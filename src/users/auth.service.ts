import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(public readonly userService: UsersService) {}
  public async signUp(email: string, password: string) {
    // see if email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email provided in use');
    }
    // Hash the users password
    const result = await this.hashPassword(password);
    // create a new user and save it
    const user = await this.userService.create({ email, password: result });
    return user;
    // return the user
  }
  private async hashPassword(password: string): Promise<string> {
    // Generating Salt
    const salt = randomBytes(8).toString('hex');

    // Hash the Salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    return salt + '.' + hash.toString('hex');
  }
  public async signIn(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    // Password Comparison;
    // Retrieving salt from hash
    const [salt, storedHash] = user.password.split('.');

    if (!(await this.verifyPassword(password, salt, storedHash))) {
      throw new BadRequestException('Invalid Credentials');
    }
    return user;
  }

  public async verifyPassword(
    password: string,
    salt: string,
    storedHash: string,
  ) {
    // hash the password with the same salt as before
    const hashPassword = (await scrypt(password, salt, 32)) as Buffer;
    // Compare the hash of the sent password with the stored hash
    if (storedHash !== hashPassword.toString('hex')) {
      return false;
    }
    return true;
  }
}
