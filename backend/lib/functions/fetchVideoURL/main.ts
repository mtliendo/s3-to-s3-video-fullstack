import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export const handler = async (event: any) => {
	const clientParams = { region: process.env.REGION }

	const getObjectParams = {
		Bucket: process.env.BUCKET_NAME,
		Key: `protected/${event.arguments.key}`,
	}
	const client = new S3Client(clientParams)
	const command = new GetObjectCommand(getObjectParams)
	const url = await getSignedUrl(client, command, { expiresIn: 3600 })

	return url
}
