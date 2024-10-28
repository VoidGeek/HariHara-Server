import { Module } from '@nestjs/common';
import { SevasController } from './sevas.controller';
import { SevasService } from './sevas.service';

@Module({
  controllers: [SevasController],
  providers: [SevasService],
})
export class SevasModule {}
