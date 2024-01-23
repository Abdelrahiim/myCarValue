import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create_user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('auth/sign-up')
  public create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}
