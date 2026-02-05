import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Upload } from './Upload';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  correo!: string;

  @Column({ length: 255 })
  nombre!: string;

  @Column({ length: 20 })
  telefono!: string;

  @Column({ length: 100 })
  ciudad!: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  // Relación con Upload
  @ManyToOne(() => Upload, upload => upload.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploadId' })
  upload!: Upload;

  @Column()
  uploadId!: number;
  
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
