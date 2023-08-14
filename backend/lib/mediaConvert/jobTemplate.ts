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
			OutputGroups: [
				{
					Name: 'File Group',
					OutputGroupSettings: {
						Type: 'FILE_GROUP_SETTINGS',
						FileGroupSettings: {
							Destination: `s3://${props.destinationBucketName}/protected/`,
						},
					},
					Outputs: [
						{
							VideoDescription: {
								CodecSettings: {
									Codec: 'H_264',
									H264Settings: {
										RateControlMode: 'QVBR',
										SceneChangeDetect: 'TRANSITION_DETECTION',
									},
								},
								Height: 1080,
							},
						},
					],
				},
			],
		},
	})

	return mediaConvertJob
}
