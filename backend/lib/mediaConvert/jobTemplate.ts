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
			Inputs: [
				{
					AudioSelectors: {
						'Audio Selector 1': {
							Offset: 0,
							DefaultSelection: 'DEFAULT',
							ProgramSelection: 1,
						},
					},
				},
			],
			OutputGroups: [
				{
					Name: 'File Group',
					Outputs: [
						{
							ContainerSettings: {
								Container: 'MP4',
								Mp4Settings: {},
							},
							VideoDescription: {
								CodecSettings: {
									Codec: 'H_264',
									H264Settings: {
										MaxBitrate: 5000000,
										RateControlMode: 'QVBR',
										SceneChangeDetect: 'TRANSITION_DETECTION',
									},
								},
								Width: 1920,
								Height: 1080,
							},
							AudioDescriptions: [
								{
									AudioSelectorName: 'Audio Selector 1',
									CodecSettings: {
										Codec: 'PASSTHROUGH',
									},
								},
							],
						},
					],
					OutputGroupSettings: {
						Type: 'FILE_GROUP_SETTINGS',
						FileGroupSettings: {
							Destination: `s3://${props.destinationBucketName}/protected/`,
						},
					},
				},
			],
		},
	})

	return mediaConvertJob
}
