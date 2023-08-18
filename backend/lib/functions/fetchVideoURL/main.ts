import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export const handler = async (event: any) => {
	const client = new S3Client({ region: process.env.REGION })

	const command = new GetObjectCommand({
		Bucket: process.env.BUCKET_NAME,
		Key: `protected/${event.arguments.key}`,
	})
	const url = await getSignedUrl(client, command, {
		expiresIn: 3600,
	})

	return url
}
