import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // console.log('GlobalExceptionHandler caught an exception:', exception);
    // console.log('response : ', response);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();
      error =
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? (exceptionResponse as Record<string, unknown>)
          : { message: exceptionResponse };

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const res = exceptionResponse as { message?: string | string[] };
        message = res.message ?? message;
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      error = exception as unknown as Record<string, unknown>;

      const err = exception as QueryFailedError & {
        code?: string;
        detail?: string;
      };

      // PostgreSQL error codes
      if (err.code === '23505') {
        message = 'Duplicate entry (unique constraint violation)';
      } else if (err.code === '23503') {
        message = 'Foreign key violation';
      } else {
        message = 'Database error';
      }
    }

    const errorResponse = new ErrorResponseDto({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message: message,
    });
    response.status(status).json(errorResponse);
  }
}
