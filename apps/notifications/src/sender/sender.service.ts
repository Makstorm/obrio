import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class SenderService {
  public async sendNotification(dto: SendNotificationDto) {
    console.log('queue handling:', { dto });
  }
}
