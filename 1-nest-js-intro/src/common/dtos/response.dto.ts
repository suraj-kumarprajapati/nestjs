export class ResponseDto<T = unknown> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string | string[];
  data?: T;

  constructor(partial: Partial<ResponseDto<T>>) {
    this.success = partial.success ?? true;
    this.statusCode = partial.statusCode ?? 200;
    this.timestamp = partial.timestamp ?? new Date().toISOString();
    this.path = partial.path ?? '';
    this.message = partial.message;
    this.data = partial.data;
  }
}
