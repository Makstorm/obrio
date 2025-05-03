import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../interfaces';

const getCurrentUserByContext = (context: ExecutionContext): IUser => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
