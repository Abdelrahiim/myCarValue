import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  public async create(userCredentials: CreateUserDto) {
    const user = this.user.create({ ...userCredentials });
    return this.user.save(user);
  }
  public async retrieve(id: number) {
    if (!id) {
      throw new NotFoundException('User Not defined');
    }
    return this.user.findOneBy({ id });
  }
  find(email: string) {
    return this.user.find({
      where: {
        email,
      },
    });
  }
  public async list() {}
  public async update(id: number, attrs: Partial<User>) {
    // first Way
    const user = await this.retrieve(id);
    if (!user) {
      throw new NotFoundException('Not Found');
    }
    Object.assign(user, attrs);
    return this.user.save(user);

    // Second Way actually both sucks
    // return this.user
    //   .createQueryBuilder()
    //   .update()
    //   .set({ ...attrs })
    //   .where('id = :id', { id });
  }
  public async remove(id: number) {
    const user = await this.retrieve(id);
    if (!user) {
      throw new NotFoundException('Not Found');
    }
    return this.user.remove(user);
  }
}
