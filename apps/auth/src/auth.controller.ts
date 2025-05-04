import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '@app/common';
import { User } from '.prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.login(user, res);
    res.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  public async authenticate(@Payload() data: any): Promise<User> {
    return data.user;
  }
}
