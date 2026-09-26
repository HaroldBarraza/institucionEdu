import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from './generated/prisma/client.js';
import { Response } from 'express';
import { STATUS_CODES } from 'http';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    switch (exception.code) {
      case 'P2001':
        return response
          .status(404)
          .json({ status_Code: 404, message: 'Registro no encontrado' });
      case 'P2002':
        return response.status(409).json({
          status_Code: 409,
          message: 'Ya existe un registro con ese valor unico',
        });
      case 'P2025':
        return response
          .status(404)
          .json({ status_Code: 404, message: 'Registro no encontrado' });

      default:
        throw exception;
    }
  }
}
