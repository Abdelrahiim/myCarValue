import { IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  @MaxLength(32)
  @MinLength(8)
  password: string;
}
