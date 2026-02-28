import { Body, Controller, Post, Res, Req, UseGuards, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'libs/dtos/create.user.dto';
import type { Response as ExpressResponse } from 'express';
import { ActivitiesService } from 'src/activities/activities.service';
import { CreateActivityDto } from 'libs/dtos/create.activity.dto';
import { JwtAuthGuard } from 'libs/common/jwt.guard';

@Controller('api-gateway')
export class ApiGatewayController {
  constructor(private readonly usersService: UsersService,
              private readonly activitiesService: ActivitiesService
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Post('login')
async login(
  @Body() body: { email: string; password: string },
  @Res({ passthrough: true }) res: any,
) {
  const result = await this.usersService.login(
    body.email,
    body.password,
  );

  res.cookie('access_token', result.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // IMPORTANT pentru localhost
  });

  return { message: 'Logged in' };
}


@Post("logout")
    logout(@Res({ passthrough: true }) res: ExpressResponse){
        return this.usersService.logout(res);
    }

    @Post('activities')
@UseGuards(JwtAuthGuard)
async createActivity(@Body() body: CreateActivityDto, @Req() req: Request) {
  const userId = (req as any).user.id;

  return this.activitiesService.create({
    ...body,
    userId,
  });
}


//activitati alese de user
@UseGuards(JwtAuthGuard)
async getUserActivities(@Req() req: Request) {
  const userId = (req as any).user.id;

  return this.activitiesService.findAllByUser(userId);
}

//lista completă de activități disponibile**
  @Get('available-activities')
  @UseGuards(JwtAuthGuard)
  async getAvailableActivities() {
    return this.activitiesService.findAll(); // toate activitiesTypes
  }

}
