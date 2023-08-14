import { CfnJobTemplate } from 'aws-cdk-lib/aws-mediaconvert'
import { Construct } from 'constructs'

type createVideoDownscaleJobProps = {
	appName: string
	destinationBucketName: string
}

export const createVideoDownscaleJob = (
	scope: Construct,
	props: createVideoDownscaleJobProps
) => {
	const mediaConvertJob = new CfnJobTemplate(scope, 'JobTemplate', {
		name: `${props.appName}-media-convert-job-template`,
		settingsJson: {
			outputGroups: [
				{
					name: 'File Group',
					outputGroupSettings: {
						type: 'FILE_GROUP_SETTINGS',
						fileGroupSettings: {
							destination: `s3://${props.destinationBucketName}/protected/`,
						},
					},
					outputs: [
						{
							videoDescription: {
								height: 1080,
								codecSettings: {
									codec: 'H_264',
								},
							},
						},
					],
				},
			],
		},
	})

	return mediaConvertJob
}
