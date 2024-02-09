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
  Session,
  HttpCode,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create_user.dto';
import { UpdateUserDto } from './dtos/update_user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('auth/sign-up')
  @HttpCode(201)
  public async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
  }

  @Post('auth/sign-in')
  @HttpCode(200)
  public async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
  }

  // Not wanted anymore
  @Post('create')
  public create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Delete('/sign-out')
  signOut(@Session() session: any) {
    session.userId = null;
    console.log('Sign out correctly');
    return 'Sign out correctly';
  }
  @Get('/me')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  public async findUser(@Param('id') id: string, @CurrentUser() user2) {
    console.log(user2);
    const user = await this.usersService.retrieve(Number(id));
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
