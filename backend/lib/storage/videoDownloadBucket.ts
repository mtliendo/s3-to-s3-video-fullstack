import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'

type VideoDownloadBucketProps = {
	appName: string
	authenticatedRole: iam.IRole
}

export function createVideoDownloadBucket(
	scope: Construct,
	props: VideoDownloadBucketProps
) {
	const fileStorageBucket = new s3.Bucket(
		scope,
		`${props.appName}-download-bucket`,
		{
			cors: [
				{
					allowedMethods: [s3.HttpMethods.GET],
					allowedOrigins: ['*'],
					allowedHeaders: ['*'],
					exposedHeaders: [
						'x-amz-server-side-encryption',
						'x-amz-request-id',
						'x-amz-id-2',
						'ETag',
					],
				},
			],
		}
	)

	// Let signed in users Download their own objects in a protected directory
	const canReadFromOwnProtectedDirectory = new iam.PolicyStatement({
		effect: iam.Effect.ALLOW,
		actions: ['s3:GetObject'],
		resources: [
			`arn:aws:s3:::${fileStorageBucket.bucketName}/protected/\${cognito-identity.amazonaws.com:sub}/*`,
		],
	})

	new iam.ManagedPolicy(scope, 'SignedInUserManagedPolicy', {
		description:
			'managed Policy to allow access to s3 bucket by signed in users.',
		statements: [canReadFromOwnProtectedDirectory],
		roles: [props.authenticatedRole],
	})

	return fileStorageBucket
}
