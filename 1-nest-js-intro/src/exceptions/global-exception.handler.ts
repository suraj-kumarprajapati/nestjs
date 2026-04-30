import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
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

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

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
    }

    if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;

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

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
