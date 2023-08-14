import { S3Handler } from 'aws-lambda'
import { MediaConvert } from 'aws-sdk'

const mediaConvert = new MediaConvert()

export const handler: S3Handler = async (event) => {
	const s3Key = decodeURIComponent(
		event.Records[0].s3.object.key.replace(/\+/g, ' ')
	)

	const mediaConvertParams = {
		Role: 'ROLE_ARN', // Update with the IAM role that you want MediaConvert to assume for this job
		JobTemplate: 'process.env.JOB_TEMPLATE_NAME', // Update with the MediaConvert job template that you want to use
		Settings: {},
	}

	try {
		await mediaConvert.createJob(mediaConvertParams).promise()
		console.log(`MediaConvert job has been created for file ${s3Key}`)
	} catch (error: any) {
		console.error(`An error occurred when creating MediaConvert job: ${error}`)
		throw new Error(error)
	}
}
