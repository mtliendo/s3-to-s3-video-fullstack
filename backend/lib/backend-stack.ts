import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createAuth } from './auth/cognito'
import { createVideoUploadBucket } from './storage/videoUploadBucket'
import { createVideoDownloadBucket } from './storage/videoDownloadBucket'
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications'
import { createConvertMediaFunction } from './functions/convertMediaFunction/construct'

export class BackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)
		const appName = 's3-to-s3-video-fullstack'

		const convertMediaFunction = createConvertMediaFunction(this, { appName })

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

		videoUploadBucket.addObjectCreatedNotification(
			new LambdaDestination(convertMediaFunction)
		)
	}
}
