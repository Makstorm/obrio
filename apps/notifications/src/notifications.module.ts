import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule, PUSH_NOTIFICATIONS_QUEUE } from '@app/common';
import { BullModule } from '@nestjs/bullmq';
import { SenderModule } from './sender/sender.module';
import { NotificationsWorker } from './notifications.worker';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        WEBHOOK_SITE_URL: Joi.string().required(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: 1000,
          removeOnFail: 3000,
          backoff: 2000,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: PUSH_NOTIFICATIONS_QUEUE }),
    LoggerModule,
    SenderModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsWorker],
})
export class NotificationsModule {}
