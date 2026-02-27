import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/database';
import { RabbitModule } from '@app/rabbit';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'libs/common/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    RabbitModule,
    PassportModule, // 🔥 IMPORTANT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        return {
          secret: secret ?? 'dev-secret-please-set-in-env',
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
