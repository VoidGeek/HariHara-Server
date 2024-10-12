import {
  Injectable,
  OnModuleInit,
  INestApplication,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // Connect to the Prisma client when the module initializes
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect from Prisma when the module is destroyed
  }

  async enableShutdownHooks(app: INestApplication) {
    await app.close(); // Close the NestJS application when called
  }
}
