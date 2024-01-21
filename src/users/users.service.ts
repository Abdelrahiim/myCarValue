import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  public async createUser(userCrediential: CreateUserDto) {}
}
