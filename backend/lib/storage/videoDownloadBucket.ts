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
		`${props.appName}-download-bucket`
	)

	return fileStorageBucket
}
