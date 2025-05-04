import { PUSH_NOTIFICATIONS_QUEUE } from '@app/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
// For the multiple jobs type handling we would use a regular BUll module
// but in context of our test task where we have only one notification type we use the BullMQ
import { Job } from 'bullmq';
import { SenderService } from './sender/sender.service';
import { ScheduleNotificationDto } from './dto/schedule-notification.dto';

@Processor(PUSH_NOTIFICATIONS_QUEUE, { concurrency: 3 }) // Can specify as many simultaneously processing as container can handle
export class NotificationsWorker extends WorkerHost {
  private readonly logger = new Logger(NotificationsWorker.name);
  constructor(private readonly senderService: SenderService) {
    super();
  }

  public async process(
    job: Job<ScheduleNotificationDto, unknown, string>,
  ): Promise<void> {
    this.senderService.sendNotification({ ...job.data, jobId: job.id });
  }

  @OnWorkerEvent('active')
  public async onActive(
    job: Job<ScheduleNotificationDto, unknown, string>,
  ): Promise<void> {
    this.logger.log(`Processing job with id ${job.id}`);
  }

  @OnWorkerEvent('completed')
  public async onCompleted(
    job: Job<ScheduleNotificationDto, unknown, string>,
  ): Promise<void> {
    this.logger.log(`Job with id ${job.id} COMPLETED!`);
  }

  @OnWorkerEvent('failed')
  public async onFailed(
    job: Job<ScheduleNotificationDto, unknown, string>,
  ): Promise<void> {
    this.logger.error(
      `Job with id ${job.id} FAILED! Attempt Number ${job.attemptsMade}`,
    );
  }
}
