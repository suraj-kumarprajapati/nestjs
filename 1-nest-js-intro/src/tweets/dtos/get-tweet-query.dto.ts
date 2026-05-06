import { IntersectionType } from '@nestjs/mapped-types';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';

export class GetTweetBaseDto {
  @IsOptional()
  @IsDate({ message: 'startDate must be a valid date' })
  startDate?: Date;

  @IsOptional()
  @IsDate({ message: 'endDate must be a valid date' })
  endDate?: Date;
}

export class GetTweetQueryDto extends IntersectionType(
  PaginationQueryDto,
  GetTweetBaseDto,
) {
  // You can add more query parameters here if needed
}
