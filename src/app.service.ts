import {
  AdminInitiateAuthCommand,
  AuthFlowType,
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { Injectable } from '@nestjs/common';
import { CognitoJwtVerifier } from "aws-jwt-verify";

@Injectable()
export class AppService {

  private userPoolId = process.env.COGNITO_USER_POOL_ID;
  private clientId = process.env.COGNITO_CLIENT_ID;
  private cognitoClient: CognitoIdentityProviderClient;
  private credentials = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  }

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.REGION,
      credentials: this.credentials
    });
  }

  login(username: string, password: string) {
    const command = new AdminInitiateAuthCommand({
      AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
    });

    return this.cognitoClient.send(command);
  }

  refreshAccessToken(refreshToken: string) {
    const client = new CognitoIdentityProviderClient({
      region: process.env.REGION,
      credentials: this.credentials,
    });

    const command = new AdminInitiateAuthCommand({

      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      },
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
    });

    return this.cognitoClient.send(command);
  }

  confirmPassword(username: string, password: string, session: string) {
    const client = new CognitoIdentityProviderClient({});

    const command = new RespondToAuthChallengeCommand({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.clientId,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: password
      },
      Session: session
    });

    return this.cognitoClient.send(command);
  }

  forgotPassword(username: string) {
    const client = new CognitoIdentityProviderClient({});

    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: username
    });

    return this.cognitoClient.send(command);
  }

  changePassword(accessToken: string, oldPassword: string, newPassword: string) {
    const client = new CognitoIdentityProviderClient({});

    const command = new ChangePasswordCommand({
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken
    });

    return this.cognitoClient.send(command);
  }

  async validateAccessToken(accessToken: string) {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: "access",
      clientId: this.clientId,
    });

    return verifier.verify(accessToken);
  }
}
