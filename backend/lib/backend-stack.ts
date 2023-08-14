import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createAuth } from './auth/cognito'
import { createVideoUploadBucket } from './storage/videoUploadBucket'
import { createVideoDownloadBucket } from './storage/videoDownloadBucket'
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications'
import { createConvertMediaFunction } from './functions/convertMediaFunction/construct'
import { createMediaConvertRole } from './mediaConvert/role'
import { createVideoDownscaleJob } from './mediaConvert/jobTemplate'

export class BackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)
		const appName = 's3-to-s3-video-fullstack'

		const { userPool, identityPool, userPoolClient } = createAuth(this, {
			appName,
		})

		const videoUploadBucket = createVideoUploadBucket(this, {
			appName,
			authenticatedRole: identityPool.authenticatedRole,
		})

		const videoDownloadBucket = createVideoDownloadBucket(this, {
			appName,
			authenticatedRole: identityPool.authenticatedRole,
		})
		const convertMediaFunction = createConvertMediaFunction(this, {
			appName,
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

		convertMediaFunction.addEnvironment('ROLE_ARN', mediaConvertRole.roleArn)
		convertMediaFunction.addEnvironment(
			'JOB_TEMPLATE_NAME',
			mediaConvertJobTemplate.attrArn
		)

		videoUploadBucket.addObjectCreatedNotification(
			new LambdaDestination(convertMediaFunction),
			{ prefix: 'protected' },
			{ suffix: 'mp4' }
		)
	}
}
