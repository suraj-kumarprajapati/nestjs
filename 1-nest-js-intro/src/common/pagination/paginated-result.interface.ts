export interface PaginatedResult<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    last: string;
    current: string;
    next: string | null;
    previous: string | null;
  };
}
