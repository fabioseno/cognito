import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pool = new cognito.UserPool(this, 'CognitoPool', {
      userPoolName: 'CognitoPool',
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      passwordPolicy: {
        minLength: 6,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: true,
        requireSymbols: false,
      },
      signInAliases: {
        email: true,
      },
      customAttributes: {
        age: new cognito.NumberAttribute({
          min: 0,
          max: 120,
        }),
        phone: new cognito.StringAttribute(),
        pushToken: new cognito.StringAttribute(),
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    pool.addClient('app-client', {
      userPoolClientName: 'dashboard-app',
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
      },
    });
  }
}
