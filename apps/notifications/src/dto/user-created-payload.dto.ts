import { IsEmail } from 'class-validator';

export class UserCreatedPayload {
  @IsEmail()
  public email: string;
}
