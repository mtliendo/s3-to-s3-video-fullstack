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
							},
							AudioDescriptions: [
								{
									CodecSettings: {
										Codec: 'AAC',
										AacSettings: {
											Bitrate: 96000,
											CodingMode: 'CODING_MODE_2_0',
											SampleRate: 48000,
										},
									},
								},
							],
						},
					],
					OutputGroupSettings: {
						Type: 'FILE_GROUP_SETTINGS',
						FileGroupSettings: {
							Destination: 's3://cdk-hnb659fds-assets-842537737558-us-east-2/',
						},
					},
				},
			],
		},
	})

	return mediaConvertJob
}
