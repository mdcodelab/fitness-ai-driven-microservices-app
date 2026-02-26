import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/database';
import { RabbitModule } from '@app/rabbit';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    RabbitModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          console.warn('[UsersModule] JWT_SECRET not set in environment; using temporary dev secret. Set JWT_SECRET in your .env for production.');
        }
        return {
          secret: secret ?? 'dev-secret-please-set-in-env',
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
