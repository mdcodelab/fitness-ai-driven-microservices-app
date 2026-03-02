import { Injectable } from '@nestjs/common';
import { RabbitService } from '@app/rabbit';
import { DatabaseService } from '@app/database';
import { BadRequestException, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    private readonly rabbitService: RabbitService,
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async create(data: any) {
    const existingUser = await this.databaseService.client.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    };
    // 1️⃣ Hash the password and save to DB using the Prisma client exposed by DatabaseService
    const hashedPassword = await argon2.hash(data.password);
    const user = await this.databaseService.client.user.create({
      data: { ...data, password: hashedPassword },
    });

    // Avoid logging sensitive fields like the password
    const { password: _pw, ...userSafe } = user as any;
    console.log('User saved in DB:', userSafe);

    // 2️⃣ Publish event ONLY after DB succeeded. RabbitMQ publish expects (exchange, routingKey, message)
    try {
      await this.rabbitService.publish('user.exchange', 'user.created', userSafe);
    } catch (err) {
      // Log but don't fail the request — event publishing is best-effort.
      console.error('[UsersService] Failed to publish user.created event:', err);
    }

    // Return user without password field
    return userSafe;
  }



  async login(email: string, password: string) {
    const user = await this.databaseService.client.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token, user: {
    id: user.id,
    first_name: user.first_name,
    email: user.email
  }
    };
  }

  async logout(res: any) {
    // For JWT, logout is typically handled client-side by deleting the token.
    // Optionally, you could implement token blacklisting here.
    // Clear both cookie names we accept so clients are fully logged out.
    try {
      res.clearCookie('jwt');
      res.clearCookie('access_token');
    } catch (err) {
      // ignore if response not passed
    }
    return { message: 'Logged out successfully' };
  }


  async findById(id: string) {
    const user = await this.databaseService.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        createdAt: true,
      },
    });
    return user;
  }
}
