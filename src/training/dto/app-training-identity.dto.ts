import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AppTrainingIdentityDto {
  @IsOptional()
  @IsString({ message: 'El documento debe ser texto' })
  document?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email no válido' })
  email?: string;
}