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
      map((payload) => {
        // Si el service retorna { data, meta } (respuesta paginada),
        // elevamos meta al nivel raíz para evitar data.data anidado
        const isPaginated =
          payload !== null &&
          typeof payload === 'object' &&
          Array.isArray(payload.data) &&
          typeof payload.meta === 'object';

        if (isPaginated) {
          return {
            statusCode,
            status: statusCode < 400,
            message,
            data: payload.data,
            meta: payload.meta,
          };
        }

        return {
          statusCode,
          status: statusCode < 400,
          message,
          ...(payload !== undefined && payload !== null
            ? { data: payload }
            : {}),
        };
      }),
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
