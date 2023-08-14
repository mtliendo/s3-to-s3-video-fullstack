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

	return fileStorageBucket
}
