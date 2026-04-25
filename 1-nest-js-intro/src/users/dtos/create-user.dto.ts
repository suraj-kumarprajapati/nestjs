import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateProfileDto } from 'src/profile/dtos/create-profile.dto';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => String(value).trim())
  email!: string;

  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @Transform(({ value }) => String(value).trim())
  @MaxLength(25, { message: 'Username must be at most 25 characters long' })
  username!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters long' })
  password!: string;

  @IsOptional()
  profile?: CreateProfileDto;
}
