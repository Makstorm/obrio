import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { NOTIFICATIONS_SERVICE, NOTIFICATIONS_QUEUE_EVENTS } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    try {
      const newUser = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        },
      });

      this.notificationsService.emit(
        NOTIFICATIONS_QUEUE_EVENTS.NEW_USER_NOTIFICATION,
        {
          email: newUser.email,
        },
      );

      return newUser;
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUserDto.email },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException(
      `User with email ${createUserDto.email} already exists`,
    );
  }

  public async verifyUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async getUser(getUserDto: GetUserDto) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id: +getUserDto.id },
    });
  }
}
