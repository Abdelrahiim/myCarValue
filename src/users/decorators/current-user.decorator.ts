import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    // get request objects
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
