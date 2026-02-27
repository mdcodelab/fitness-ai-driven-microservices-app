import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Use require + interop guard so cookie-parser works regardless of CJS/ESM
// bundling differences that can wrap the function under `.default`.
const _cookieParserMod = require('cookie-parser');
const cookieParser = (_cookieParserMod && typeof _cookieParserMod === 'object' && 'default' in _cookieParserMod)
  ? _cookieParserMod.default
  : _cookieParserMod;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
