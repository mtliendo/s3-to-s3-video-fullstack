import { S3 } from 'aws-sdk'
import { APIGatewayProxyHandler } from 'aws-lambda'

const s3 = new S3()

export const handler: APIGatewayProxyHandler = async (event) => {
	// parse the body from the event
	console.log(event.body)
	const { objectKey } = JSON.parse(event.body!)

	const bucketName = process.env.BUCKET_NAME

	const url = s3.getSignedUrl('getObject', {
		Bucket: bucketName,
		Key: objectKey,
		Expires: 3600, // URL expires in 1 hour
	})

	return {
		statusCode: 200,
		body: JSON.stringify({
			url: url,
		}),
	}
}
