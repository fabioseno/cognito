import {
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  AuthFlowType,
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  GetUserCommand,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { AdminUpdateUser } from "./interfaces";

@Injectable()
export class AppService {

  private userPoolId = this.configService.get('COGNITO_USER_POOL_ID');
  private clientId = this.configService.get('COGNITO_CLIENT_ID');
  private cognitoClient: CognitoIdentityProviderClient;
  private credentials = {
    accessKeyId: this.configService.get('ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
  }

  constructor(private configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get('REGION'),
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

    return this.cognitoClient.send(command).catch(error => {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException();
      }
    });
  }

  refreshAccessToken(refreshToken: string) {
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
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: username
    });

    return this.cognitoClient.send(command);
  }

  changePassword(accessToken: string, oldPassword: string, newPassword: string) {
    const command = new ChangePasswordCommand({
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken
    });

    return this.cognitoClient.send(command);
  }

  validateAccessToken(accessToken: string) {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: "access",
      clientId: this.clientId,
    });

    return verifier.verify(accessToken);
  }

  getUser(accessToken: string) {
    const command = new GetUserCommand({
      AccessToken: accessToken
    });
    return this.cognitoClient.send(command);
  }

  // admin endpoints
  adminGetUser(username: string) {
    const command = new AdminGetUserCommand({
      Username: username,
      UserPoolId: this.userPoolId
    });
    return this.cognitoClient.send(command);
  }

  adminSetUserPassword(username: string, password: string) {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Password: password,
      Permanent: true
    });

    return this.cognitoClient.send(command);
  }

  adminUpdateUser(username: string, data: AdminUpdateUser) {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:pushToken',
          Value: data.pushNotificationToken
        },
        {
          Name: 'custom:phone',
          Value: data.phone
        },
        {
          Name: 'custom:age',
          Value: data.age.toString()
        }
      ]
    });

    return this.cognitoClient.send(command);
  }
}
