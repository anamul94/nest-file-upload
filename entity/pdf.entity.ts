import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PdfFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({ type: 'bytea' })
  data: Buffer;
}
