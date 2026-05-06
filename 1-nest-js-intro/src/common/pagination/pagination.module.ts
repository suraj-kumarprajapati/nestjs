import { Module } from '@nestjs/common';
import { PaginationProvider } from './pagination.provider';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider], // export the service to be used in other modules
})
export class PaginationModule {}
