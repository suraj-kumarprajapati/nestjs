import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { OrderBy } from '../enums/order-by.enum';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @IsPositive({ message: 'Limit must be a positive integer' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be a positive integer' })
  page: number = 1;

  @IsOptional()
  @IsString({ message: 'sortedBy must be a string' })
  sortedBy?: string;

  @IsOptional()
  @IsString({ message: "orderBy must be 'ASC or DESC'" })
  orderBy?: OrderBy;
}
