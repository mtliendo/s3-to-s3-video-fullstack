import { CfnJobTemplate } from 'aws-cdk-lib/aws-mediaconvert'
import { Construct } from 'constructs'

type createVideoDownscaleJobProps = {
	appName: string
}

export const createVideoDownscaleJob = (
	scope: Construct,
	props: createVideoDownscaleJobProps
) => {
	const mediaConvertJob = new CfnJobTemplate(scope, 'JobTemplate', {
		name: props.appName,
		settingsJson: {
			outputGroups: [
				{
					name: 'File Group',
					outputGroupSettings: {
						type: 'FILE_GROUP_SETTINGS',
						fileGroupSettings: {
							destination: 's3://DESTINATION_BUCKET/',
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
