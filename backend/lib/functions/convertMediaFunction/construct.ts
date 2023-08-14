import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import path = require('path')
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

type createConvertMediaFunctionProps = {
	appName: string
}
export const createConvertMediaFunction = (
	scope: Construct,
	props: createConvertMediaFunctionProps
) => {
	const convertMediaFunction = new NodejsFunction(
		scope,
		`${props.appName}-convertMediaFunction`,
		{
			functionName: `${props.appName}-convertMediaFunction`,
			runtime: Runtime.NODEJS_16_X,
			handler: 'handler',
			entry: path.join(__dirname, `./main.ts`),
			bundling: {
				nodeModules: ['aws-lambda'],
			},
		}
	)

	// ALLOW PUT METHOD TO ACCESS USER TABLE
	// convertMediaFunction.addToRolePolicy(
	// 	new PolicyStatement({
	// 		actions: ['dynamodb:PutItem'],
	// 		resources: [props.userTableArn],
	// 	})
	// )

	return convertMediaFunction
}
