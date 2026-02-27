import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret =
      config.get<string>('JWT_SECRET') ?? process.env.JWT_SECRET ?? 'dev-secret-please-set-in-env';

    super({
      jwtFromRequest: (req: Request) => {
        // Prefer cookie-based token, fallback to Authorization Bearer
        const cookieToken = req?.cookies?.access_token ?? req?.cookies?.jwt;
        if (cookieToken) return cookieToken;
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
