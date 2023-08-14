import { S3 } from 'aws-sdk'

const s3 = new S3()

export const handler = async (event: any) => {
	// parse the body from the event
	console.log(event)
	const { key } = event.arguments

	const bucketName = process.env.BUCKET_NAME

	const url = s3.getSignedUrl('getObject', {
		Bucket: bucketName,
		Key: key,
		Expires: 3600, // URL expires in 1 hour
	})

	return url
}
