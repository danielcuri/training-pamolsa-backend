import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/** Orígenes CORS desde CORS_ORIGIN (.env); varios separados por coma. Si falta, se usa el frontend por defecto. */
function resolveCorsOrigin(): string | string[] {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) return 'http://localhost:4100';
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length === 1 ? parts[0]! : parts;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProd = process.env.NODE_ENV === 'production';
  // En producción Swagger está apagado por defecto; solo con ENABLE_SWAGGER=true se activa.
  // En desarrollo sigue activo salvo ENABLE_SWAGGER=false.
  const enableDocs =
    process.env.ENABLE_SWAGGER === 'true' ||
    (!isProd && process.env.ENABLE_SWAGGER !== 'false');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: resolveCorsOrigin(),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());

  if (enableDocs) {
    const config = new DocumentBuilder()
      .setTitle('Training Pamolsa API')
      .setDescription(
        'Esquemas generados a partir de los DTOs y decoradores class-validator (plugin @nestjs/swagger).',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT devuelto por POST /api/auth/login',
        },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(3000);
}
bootstrap();
