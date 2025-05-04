import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SenderService } from './sender.service';

@Module({
  imports: [HttpModule],
  providers: [SenderService],
  exports: [SenderService],
})
export class SenderModule {}
