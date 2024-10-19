import { Module } from '@nestjs/common';
import { NewsupdatesService } from './newsupdates.service';
import { NewsupdatesController } from './newsupdates.controller';

@Module({
  providers: [NewsupdatesService],
  controllers: [NewsupdatesController],
})
export class NewsupdatesModule {}
