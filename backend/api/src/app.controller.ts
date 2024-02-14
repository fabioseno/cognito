import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminUserOperation } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('login')
  login(@Body() data) {
    return this.appService.login(data.username, data.password);
  }

  @Post('refresh-token')
  refreshToken(@Body() data) {
    console.log('fafa')
    return this.appService.refreshAccessToken(data.token);
  }

  @Post('set-password')
  setPassword(@Body() data) {
    return this.appService.confirmPassword(data.username, data.password, data.session);
  }

  @Post('forgot-password')
  forgotPassword(@Body() data) {
    return this.appService.forgotPassword(data.username);
  }

  @Post('change-password')
  changePassword(@Body() data) {
    return this.appService.changePassword(data.token, data.oldPassword, data.newPassword);
  }

  @Post('validate-token')
  validateAccessToken(@Body() data) {
    return this.appService.validateAccessToken(data.token);
  }

  @Get('users/:accessToken')
  getUser(@Param('accessToken') accessToken: string) {
    return this.appService.getUser(accessToken);
  }

  // admin endpoints
  @Get('admin/users/:username')
  adminGetUser(@Param('username') username: string) {
    return this.appService.adminGetUser(username);
  }

  @Patch('admin/users/:username')
  adminSetUserPassword(@Param('username') username: string, @Body() data: AdminUserOperation) {
    switch (data.operation) {
      case 'SetUserPassword':
        return this.appService.adminSetUserPassword(username, data.password);
      case 'UpdateMetadata':
        return this.appService.adminUpdateUser(username, data);
    }
  }
}
