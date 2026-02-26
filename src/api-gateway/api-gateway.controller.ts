import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'libs/dtos/create.user.dto';
import type { Response as ExpressResponse } from 'express';

@Controller('api-gateway')
export class ApiGatewayController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

@Post("logout")
    logout(@Res({ passthrough: true }) res: ExpressResponse){
        return this.usersService.logout(res);
    }
}
