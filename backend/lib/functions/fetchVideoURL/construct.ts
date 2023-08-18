import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

type createFetchVideoURLFunctionProps = {
	appName: string
	destinationBucketArn: string
}
export const createFetchVideoURLFunction = (
	scope: Construct,
	props: createFetchVideoURLFunctionProps
) => {
	const fetchVideoURLFunction = new NodejsFunction(
		scope,
		`fetch-video-url-function`,
		{
			functionName: `fetch-video-url-function`,
			runtime: Runtime.NODEJS_18_X,
			handler: 'handler',
			entry: path.join(__dirname, `./main.ts`),
			bundling: {
				nodeModules: ['aws-lambda'],
			},
		}
	)

	fetchVideoURLFunction.addToRolePolicy(
		new PolicyStatement({
			actions: ['s3:GetObject'],
			resources: [`${props.destinationBucketArn}/protected/*`],
		})
	)

	return fetchVideoURLFunction
}
