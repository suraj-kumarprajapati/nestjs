import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './pagination-query.dto';
import { ObjectLiteral } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/browser';
import { PaginatedResult } from './paginated-result.interface';
import { OrderBy } from '../enums/order-by.enum';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    queryBuilder: SelectQueryBuilder<T>,
    tableAlias?: string,
    columns: string[] = [],
  ): Promise<PaginatedResult<T>> {
    const { sortedBy, orderBy } = paginationQueryDto;

    // Apply sorting if sortedBy is provided
    if (sortedBy) {
      // validate that the sortedBy column exists in the entity
      if (!columns.includes(sortedBy)) {
        throw new BadRequestException(
          `Invalid sortedBy column: ${sortedBy} for entity ${tableAlias}`,
        );
      }

      const orderByColumn = tableAlias ? `${tableAlias}.${sortedBy}` : sortedBy;
      queryBuilder.orderBy(orderByColumn, orderBy || OrderBy.ASC);
    }

    const result: PaginatedResult<T> = await this.extractDataFromQueryBuilder(
      queryBuilder,
      paginationQueryDto,
    );

    return result;
  }

  private async extractDataFromQueryBuilder<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResult<T>> {
    // get pagination parameters from the DTO
    const { page, limit } = paginationQueryDto;

    // execute the query and get the results along with the total count
    const [data, total] = await queryBuilder.getManyAndCount();

    const lastPage = Math.ceil(total / limit);
    const firstPage = 1;

    const result: PaginatedResult<T> = {
      data: data,
      meta: {
        itemsPerPage: limit,
        totalItems: total,
        totalPages: lastPage,
        currentPage: page,
      },
      links: {
        first: `?page=${firstPage}&limit=${limit}`,
        last: `?page=${lastPage}&limit=${limit}`,
        current: `?page=${page}&limit=${limit}`,
        next: page < lastPage ? `?page=${page + 1}&limit=${limit}` : null,
        previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
      },
    };
    return result;
  }
}
