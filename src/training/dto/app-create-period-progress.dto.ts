import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreatePeriodProgressDto } from './create-period-progress.dto';

export class AppCreatePeriodProgressDto extends CreatePeriodProgressDto {
  @ApiPropertyOptional({
    description: 'Documento del usuario evaluador enviado desde la app.',
    example: '12345678',
  })
  @IsOptional()
  @IsString({ message: 'El documento debe ser texto' })
  document?: string;

  @ApiPropertyOptional({
    description: 'Email del usuario evaluador enviado desde la app.',
    example: 'email@test.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email no válido' })
  email?: string;
}