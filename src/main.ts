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

  // main.ts
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true, // esențial pentru cookie HttpOnly
});

  await app.listen(4000);
}
bootstrap();
