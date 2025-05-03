import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  public name: string;
}
