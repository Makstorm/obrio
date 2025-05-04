import { PUSH_NOTIFICATIONS_QUEUE } from '@app/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ScheduleNotificationDto } from './dto/schedule-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue(PUSH_NOTIFICATIONS_QUEUE)
    private readonly notificationsQueue: Queue,
  ) {}

  public async scheduleNotification(payload: ScheduleNotificationDto) {
    try {
      this.notificationsQueue.add('notification', payload, {
        delay: 1000 * 60 * 60 * 24, // 24 hours
      });
      this.logger.log(
        `Notification scheduled successfully, payload: ${payload}`,
      );
    } catch (err) {
      this.logger.error('Error scheduling notification', err);
    }
  }
}
