import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import csv from 'csv-parser';
import fs from 'fs';
import { DocumentRecordDTO } from '../dtos';
import { ICSVService, CSVParseResult } from '../interfaces';
import { EmptyFileError, MissingHeadersError } from '../utils/exceptions';

export interface CSVValidationError {
  row: number;
  field: string;
  value: any;
  errors: string[];
}

export class CSVService implements ICSVService {
  private requiredHeaders = ['correo', 'nombre', 'telefono', 'ciudad'];
  private optionalHeaders = ['notas'];

  async parseAndValidateCSV(filePath: string): Promise<CSVParseResult> {
    const records: any[] = [];
    const errors: CSVValidationError[] = [];

    // Leer CSV
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          records.push(row);
        })
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
    });

    // Verificar que no esté vacío
    if (records.length === 0) {
      throw new EmptyFileError();
    }

    // Verificar headers requeridos
    const firstRow = records[0];
    const missingHeaders = this.requiredHeaders.filter(
      (header) => !(header in firstRow)
    );

    if (missingHeaders.length > 0) {
      throw new MissingHeadersError(missingHeaders);
    }

    // Validar cada registro
    const validatedRecords: DocumentRecordDTO[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 2; // +2 porque la fila 1 son headers

      // Convertir a DTO
      const dto = plainToClass(DocumentRecordDTO, {
        correo: row.correo?.trim(),
        nombre: row.nombre?.trim(),
        telefono: row.telefono?.trim(),
        ciudad: row.ciudad?.trim(),
        notas: row.notas?.trim() || undefined,
      });

      // Validar con class-validator
      const validationErrors = await validate(dto);

      if (validationErrors.length > 0) {
        // Extraer errores
        validationErrors.forEach((error) => {
          const field = error.property;
          const value = (row as any)[field];
          const errorMessages = error.constraints
            ? Object.values(error.constraints)
            : ['Valor inválido'];

          errors.push({
            row: rowNumber,
            field,
            value,
            errors: errorMessages,
          });
        });
      } else {
        validatedRecords.push(dto);
      }
    }

    return {
      isValid: errors.length === 0,
      data: validatedRecords,
      errors,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
