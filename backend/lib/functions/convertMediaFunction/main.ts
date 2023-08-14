import { S3Handler } from 'aws-lambda'
import { MediaConvert } from 'aws-sdk'

const mediaConvert = new MediaConvert()

export const handler: S3Handler = async (event) => {
	const bucket = event.Records[0].s3.bucket.name
	const key = decodeURIComponent(
		event.Records[0].s3.object.key.replace(/\+/g, ' ')
	)

	// Define the parameters for the MediaConvert job
	const mediaConvertParams = {
		Role: process.env.ROLE_ARN as string, // Replace with the ARN of the IAM role that MediaConvert should assume
		JobTemplate: process.env.JOB_TEMPLATE_NAME as string, // Replace with the name or ARN of your job template
		Settings: {
			Inputs: [
				{
					FileInput: `s3://${bucket}/${key}`,
				},
			],
		},
	}

	try {
		await mediaConvert.createJob(mediaConvertParams).promise()
		console.log(`MediaConvert job has been created for file ${key}`)
	} catch (error: any) {
		console.error(`An error occurred when creating MediaConvert job: ${error}`)
		throw new Error(error)
	}
}
