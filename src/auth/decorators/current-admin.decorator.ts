import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentAdmin = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type RequestWithAdmin = {
  admin?: CurrentAdmin;
};

export const CurrentAdminUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    return request.admin;
  },
);
