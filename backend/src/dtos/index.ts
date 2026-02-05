import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsIn, IsOptional } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  name!: string;

  @IsEmail({}, { message: 'Debe ser un email válido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsNotEmpty({ message: 'Debe confirmar la contraseña' })
  confirmPassword!: string;

  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsIn(['user', 'admin'], { message: 'El rol debe ser user o admin' })
  role!: 'user' | 'admin';
}

export class LoginDTO {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password!: string;
}

export class DocumentRecordDTO {
  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  correo!: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  nombre!: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @Matches(/^[0-9]+$/, { message: 'El teléfono debe contener solo números' })
  telefono!: string;

  @IsNotEmpty({ message: 'La ciudad es requerida' })
  @IsString({ message: 'La ciudad debe ser texto' })
  ciudad!: string;

  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  notas?: string;
}

