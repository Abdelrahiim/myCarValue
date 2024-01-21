import { Body, Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create_user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  public create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
}
