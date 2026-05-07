import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './pagination-query.dto';
import { ObjectLiteral } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/browser';
import { PaginatedResult } from './paginated-result.interface';
import { OrderBy } from '../enums/order-by.enum';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    queryBuilder: SelectQueryBuilder<T>,
    tableAlias?: string,
    columns: string[] = [],
  ): Promise<PaginatedResult<T>> {
    const { page, limit, sortedBy, orderBy } = paginationQueryDto;

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
   


    // apply pagination parameters
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

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
    const baseUrl = `${this.request.protocol}://${this.request.get('host')}${this.request.path}`;

    const result: PaginatedResult<T> = {
      data: data,
      meta: {
        itemsPerPage: limit,
        totalItems: total,
        totalPages: lastPage,
        currentPage: page,
      },
      links: {
        first: `${baseUrl}?page=${firstPage}&limit=${limit}`,
        last: `${baseUrl}?page=${lastPage}&limit=${limit}`,
        current: `${baseUrl}?page=${page}&limit=${limit}`,
        next:
          page < lastPage ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
        previous:
          page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
      },
    };
    return result;
  }
}
