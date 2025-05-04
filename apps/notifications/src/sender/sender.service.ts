import { Injectable, Logger } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SenderService {
  private readonly logger = new Logger(SenderService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async sendNotification(dto: SendNotificationDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(this.configService.get('WEBHOOK_SITE_URL'), dto),
      );

      this.logger.log(
        `Notification sent successfully, job id: ${dto.jobId}, response: ${JSON.stringify(data)}`,
      );
    } catch (err) {
      this.logger.error(
        `Error sending notification, job id: ${dto.jobId}`,
        err,
      );
    }
  }
}
