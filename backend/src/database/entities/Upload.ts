import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import { Document } from './Document';

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  originalFileName!: string;

  @Column()
  filePath!: string;

  @Column()
  totalRecords!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy!: User;

  @Column()
  uploadedById!: number;

  @OneToMany(() => Document, document => document.upload, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  documents!: Document[];

  @CreateDateColumn()
  uploadedAt!: Date;
}
