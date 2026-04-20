import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../user.entity';

export class CreateUserDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Transform(({ value }) => String(value).toLowerCase().trim())
  @MaxLength(50, { message: 'First name must be at most 50 characters long' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Transform(({ value }) => String(value).toLowerCase().trim())
  @MaxLength(50, { message: 'Last name must be at most 50 characters long' })
  lastName!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => String(value).trim())
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters long' })
  password!: string;

  @IsOptional()
  // @IsIn(['male', 'female', 'other'], {
  //   message: 'Gender must be either male, female, or other',
  // })
  @IsEnum(Gender, { message: 'Gender must be either male, female, or other' })
  // gender?: string;
  gender?: Gender;
}

// export class CreateUserDto {
//   @IsInt({ message: 'ID must be an integer' })
//   @IsNotEmpty({ message: 'ID is required' })
//   id!: number;

//   @IsNumber({}, { message: 'Age must be a number' })
//   @IsNotEmpty({ message: 'Age is required' })
//   age!: number;

//   @IsString({ message: 'Name must be a string' })
//   @IsNotEmpty({ message: 'Name is required' })
//   @MinLength(3, { message: 'Name must be at least 3 characters long' })
//   @MaxLength(50, { message: 'Name must be at most 50 characters long' })
//   name!: string;

//   @IsString({ message: 'Gender must be a string' })
//   @IsOptional()
//   gender?: string;

//   @IsEmail({}, { message: 'Email must be a valid email address' })
//   @IsNotEmpty({ message: 'Email is required' })
//   email!: string;

//   @IsBoolean({ message: 'isMarried must be a boolean' })
//   isMarried!: boolean;

//   @IsString({ message: 'Password must be a string' })
//   @IsNotEmpty({ message: 'Password is required' })
//   @MinLength(6, { message: 'Password must be at least 6 characters long' })
//   @MaxLength(100, { message: 'Password must be at most 100 characters long' })
//   password!: string;
// }
