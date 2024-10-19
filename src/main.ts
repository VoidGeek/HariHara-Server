import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
      whitelist: true, // Strips properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are provided
      transform: true, // Automatically transforms payloads to be objects typed according to DTOs
      disableErrorMessages: false, // Ensures detailed validation error messages are shown
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
