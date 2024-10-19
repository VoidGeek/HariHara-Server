import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ParseIdPipe } from './common/pipes/parse-id.pipe'; // Import your ParseIdPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend origin
    credentials: true, // Allow credentials (cookies)
  });

  // Apply global validation for request bodies
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties are sent
      transform: true, // Automatically transform payloads (e.g., strings to numbers)
    }),
    new ParseIdPipe(),
  );
  // Apply PrismaExceptionFilter globally
  app.useGlobalFilters(new PrismaExceptionFilter());
  // Apply global response interceptor for consistent success message
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
