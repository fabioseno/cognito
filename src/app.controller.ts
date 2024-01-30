import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

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
}
