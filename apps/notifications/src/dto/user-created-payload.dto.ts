import { IUserCreatedPayload } from '@app/common';
import { IsEmail, IsNumber, IsPositive } from 'class-validator';

export class UserCreatedPayload implements IUserCreatedPayload {
  @IsNumber()
  @IsPositive()
  public userId: number;

  @IsEmail()
  public email: string;
}
