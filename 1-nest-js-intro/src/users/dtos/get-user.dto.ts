import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  limit: number = 5;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  page: number = 1;

}
