import { Module } from '@nestjs/common';
import { NewsUpdatesService } from './newsupdates.service';
import { NewsUpdatesController } from './newsupdates.controller';

@Module({
  providers: [NewsUpdatesService],
  controllers: [NewsUpdatesController],
})
export class NewsupdatesModule {}
