import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create_user.dto';
import { UpdateUserDto } from './dtos/update_user.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('auth/sign-up')
  public createUser(@Body() body: CreateUserDto) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('auth/sign-in')
  private signIn(@Body() body: CreateUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  // Not wanted anymore
  @Post('create')
  public create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
  @Get('/:id')
  public findUser(@Param('id') id: string) {
    const user = this.usersService.retrieve(Number(id));
    if (!user) {
      throw new NotFoundException('Not Found');
    }
    return user;
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }
}
