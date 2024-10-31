import { Module } from '@nestjs/common';
import { SevaFormService } from './sevaform.service';
import { SevaFormController } from './sevaform.controller';

@Module({
  controllers: [SevaFormController],
  providers: [SevaFormService],
})
export class SevaformModule {}
