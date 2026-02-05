import { DocumentRecordDTO } from '../../dtos';

export interface CSVValidationError {
  row: number;
  field: string;
  value: any;
  errors: string[];
}

export interface CSVParseResult {
  isValid: boolean;
  data: DocumentRecordDTO[];
  errors: CSVValidationError[];
}

export interface ICSVService {
  parseAndValidateCSV(filePath: string): Promise<CSVParseResult>;
  deleteFile(filePath: string): Promise<void>;
}
