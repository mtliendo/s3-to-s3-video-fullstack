import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createAuth } from './auth/cognito'
import { createVideoUploadBucket } from './storage/videoUploadBucket'
import { createVideoDownloadBucket } from './storage/videoDownloadBucket'
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications'
import { createConvertMediaFunction } from './functions/convertMediaFunction/construct'
import { createMediaConvertRole } from './mediaConvert/role'
import { createVideoDownscaleJob } from './mediaConvert/jobTemplate'
import { createFetchVideoURLFunction } from './functions/fetchVideoURL/construct'
import { createAmplifyGraphqlApi } from './api/appsync'

export class BackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)
		const appName = 's3-to-s3-video-fullstack'

		const { userPool, identityPool, userPoolClient } = createAuth(this, {
			appName,
		})

		const videoAPI = createAmplifyGraphqlApi(this, {
			appName,
			userpool: userPool,
			authenticatedRole: identityPool.authenticatedRole,
			unauthenticatedRole: identityPool.unauthenticatedRole,
		})

		const videoUploadBucket = createVideoUploadBucket(this, {
			appName,
			authenticatedRole: identityPool.authenticatedRole,
		})

		const videoDownloadBucket = createVideoDownloadBucket(this, {
			appName,
			authenticatedRole: identityPool.authenticatedRole,
		})

		const mediaConvertRole = createMediaConvertRole(this, {
			appName,
			sourceBucketArn: videoUploadBucket.bucketArn,
			destinationBucketArn: videoDownloadBucket.bucketArn,
		})

		const mediaConvertJobTemplate = createVideoDownscaleJob(this, {
			appName,
			destinationBucketName: videoDownloadBucket.bucketName,
		})

		const convertMediaFunction = createConvertMediaFunction(this, {
			appName,
			mediaConvertArn: mediaConvertRole.roleArn,
		})

		convertMediaFunction.addEnvironment('ROLE_ARN', mediaConvertRole.roleArn)
		convertMediaFunction.addEnvironment(
			'ENDPOINT',
			`https://q25wbt2lc.mediaconvert.${this.region}.amazonaws.com`
		)
		convertMediaFunction.addEnvironment(
			'JOB_TEMPLATE_NAME',
			mediaConvertJobTemplate.attrArn
		)

		const fetchVideoURLFunction = createFetchVideoURLFunction(this, {
			appName,
			destinationBucketArn: videoDownloadBucket.bucketArn,
		})

		fetchVideoURLFunction.addEnvironment(
			'BUCKET_NAME',
			videoDownloadBucket.bucketName
		)

		videoUploadBucket.addObjectCreatedNotification(
			new LambdaDestination(convertMediaFunction),
			{ prefix: 'protected' },
			{ suffix: 'mp4' }
		)
	}
}
