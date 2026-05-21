import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString({ message: 'El DNI debe ser texto' })
  dni?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email no válido' })
  email?: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password: string;
}
