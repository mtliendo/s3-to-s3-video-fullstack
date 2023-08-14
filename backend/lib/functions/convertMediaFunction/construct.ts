import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

type createConvertMediaFunctionProps = {
	appName: string
	mediaConvertArn: string
}
export const createConvertMediaFunction = (
	scope: Construct,
	props: createConvertMediaFunctionProps
) => {
	const convertMediaFunction = new NodejsFunction(
		scope,
		`${props.appName}-convert-media-function`,
		{
			functionName: `${props.appName}-convert-media-function`,
			runtime: Runtime.NODEJS_16_X,
			handler: 'handler',
			entry: path.join(__dirname, `./main.ts`),
			bundling: {
				nodeModules: ['aws-lambda'],
			},
		}
	)

	// Allow create job for mediaconvert
	convertMediaFunction.addToRolePolicy(
		new PolicyStatement({
			actions: ['mediaconvert:CreateJob'],
			resources: ['*'],
		})
	)

	convertMediaFunction.addToRolePolicy(
		new PolicyStatement({
			actions: ['iam:PassRole'],
			resources: [props.mediaConvertArn],
		})
	)

	return convertMediaFunction
}
