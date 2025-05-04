import { IsNotEmpty, IsString } from 'class-validator';
import { ScheduleNotificationDto } from '../../dto/schedule-notification.dto';

export class SendNotificationDto extends ScheduleNotificationDto {
  @IsNotEmpty()
  @IsString()
  public jobId: string;
}
