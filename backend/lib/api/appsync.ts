import { Construct } from 'constructs'
import * as awsAppsync from 'aws-cdk-lib/aws-appsync'
import * as path from 'path'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { AmplifyGraphqlApi } from '@aws-amplify/graphql-construct-alpha'
import { Function } from 'aws-cdk-lib/aws-lambda'

type AppSyncAPIProps = {
	appName: string
	authenticatedRole: IRole
	unauthenticatedRole: IRole
	userpool: UserPool
	getVideoURLFunc: Function
}

export function createAmplifyGraphqlApi(
	scope: Construct,
	props: AppSyncAPIProps
) {
	const api = new AmplifyGraphqlApi(scope, `${props.appName}-API`, {
		apiName: `${props.appName}-API`,

		schema: awsAppsync.SchemaFile.fromAsset(
			path.join(__dirname, './graphql/schema.graphql')
		),
		authorizationConfig: {
			defaultAuthMode: awsAppsync.AuthorizationType.USER_POOL,
			userPoolConfig: {
				userPool: props.userpool,
			},
		},
	})

	api.resources.cfnResources.cfnGraphqlApi.xrayEnabled = true

	const lambdaDataSource = api.resources.graphqlApi.addLambdaDataSource(
		'get-video-ds',
		props.getVideoURLFunc
	)

	api.resources.graphqlApi.createResolver('getVideoURL', {
		typeName: 'Query',
		fieldName: 'getVideoURL',
		dataSource: lambdaDataSource,
	})

	return api
}
