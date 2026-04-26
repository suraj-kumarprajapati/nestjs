import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTweetDto {
  @IsString({ message: 'Text must be a string' })
  @IsNotEmpty({ message: 'Text is required' })
  text!: string;

  @IsString({ message: 'Image must be a string' })
  @IsOptional()
  image?: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsInt({ message: 'User ID must be an integer' })
  userId!: number;

  @IsArray({ message: 'HashTag IDs must be an array of integers' })
  @IsInt({ each: true, message: 'Each HashTag ID must be an integer' })
  @IsOptional()
  hashTagIds?: number[]; // array of hashtag IDs
}
