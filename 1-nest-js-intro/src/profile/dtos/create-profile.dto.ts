import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class CreateProfileDto {
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase().trim())
  @MaxLength(50, { message: 'First name must be at most 50 characters long' })
  firstName?: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase().trim())
  @MaxLength(50, { message: 'Last name must be at most 50 characters long' })
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be either male, female, or other' })
  gender?: Gender;

  @IsOptional()
  @IsDate({ message: 'Date of birth must be a valid date' })
  dateOfBirth?: Date;

  @IsString({ message: 'Bio must be a string' })
  @IsOptional()
  bio?: string;

  @IsString({ message: 'Profile image must be a string' })
  @IsOptional()
  profileImage?: string;
}
