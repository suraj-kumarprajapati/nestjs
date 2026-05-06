export class ErrorResponseDto {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  error: Record<string, unknown>;
  message: string | string[];

  constructor(partial: Partial<ErrorResponseDto>) {
    this.success = partial.success ?? false;
    this.statusCode = partial.statusCode ?? 500;
    this.timestamp = partial.timestamp ?? new Date().toISOString();
    this.path = partial.path ?? '';
    this.error = partial.error ?? {};
    this.message = partial.message ?? 'Internal server error';
  }
}
