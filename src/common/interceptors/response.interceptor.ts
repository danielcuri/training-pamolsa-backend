import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode: number = response.statusCode;

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ??
      this.defaultMessage(context);

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        status: statusCode < 400,
        message,
        ...(data !== undefined && data !== null ? { data } : {}),
      })),
    );
  }

  private defaultMessage(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method as string;

    const defaults: Record<string, string> = {
      GET: 'Datos obtenidos correctamente',
      POST: 'Recurso creado correctamente',
      PATCH: 'Recurso actualizado correctamente',
      PUT: 'Recurso actualizado correctamente',
      DELETE: 'Recurso eliminado correctamente',
    };

    return defaults[method] ?? 'Operación exitosa';
  }
}
