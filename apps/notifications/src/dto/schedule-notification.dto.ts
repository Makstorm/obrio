import { IsEnum, IsNotEmpty } from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum';

export class ScheduleNotificationDto {
  @IsEnum(NotificationType)
  public notificationType: NotificationType;

  @IsNotEmpty()
  public payload: unknown;
}
