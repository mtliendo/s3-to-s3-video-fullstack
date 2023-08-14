import {
	Effect,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

type createMediaConvertRoleProps = {
	appName: string
	sourceBucketArn: string
	destinationBucketArn: string
}

export const createMediaConvertRole = (
	scope: Construct,
	props: createMediaConvertRoleProps
) => {
	// Define the MediaConvert service principal
	const mediaConvertPrincipal = new ServicePrincipal(
		'mediaconvert.amazonaws.com'
	)

	// Create the IAM role
	const mediaConvertRole = new Role(
		scope,
		`${props.appName}-mediaConvert-role`,
		{
			assumedBy: mediaConvertPrincipal,
		}
	)

	// Grant read access to the source bucket
	mediaConvertRole.addToPolicy(
		new PolicyStatement({
			actions: ['s3:GetObject', 's3:GetObjectVersion'],
			resources: [`${props.sourceBucketArn}/protected/*`],
			effect: Effect.ALLOW,
		})
	)

	// Grant write access to the destination bucket
	mediaConvertRole.addToPolicy(
		new PolicyStatement({
			actions: ['s3:PutObject'],
			resources: [`${props.destinationBucketArn}/protected/*`],
			effect: Effect.ALLOW,
		})
	)

	return mediaConvertRole
}
