import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NOTIFICATIONS_QUEUE_EVENTS } from '@app/common';
import { UserCreatedPayload } from './dto/user-created-payload.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern(NOTIFICATIONS_QUEUE_EVENTS.NEW_USER_NOTIFICATION)
  public async userCreatedEvent(@Payload() data: UserCreatedPayload) {
    console.log('Mock new user notification event:', data);
  }
}
