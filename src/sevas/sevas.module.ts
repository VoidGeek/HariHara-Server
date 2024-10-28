import { Module } from '@nestjs/common';
import { SevasService } from './sevas.service';
import { SevasController } from './sevas.controller';

@Module({
  providers: [SevasService],
  controllers: [SevasController],
})
export class SevaModule {}
