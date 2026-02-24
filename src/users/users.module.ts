import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/database';
import { RabbitModule } from '@app/rabbit';

@Module({
  imports: [DatabaseModule, RabbitModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
