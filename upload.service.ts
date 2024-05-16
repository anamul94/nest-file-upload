import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfFile } from './entity/pdf.entity';
import PdfFileRepository from './pdf-file-repository';
import { PDFDocument } from 'pdf-lib';



@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(PdfFile)
    private readonly pdfFileRepository: PdfFileRepository,
  ) {}

  async saveFile(filename: string, data: Buffer): Promise<PdfFile> {
    const newFile = this.pdfFileRepository.create({ filename, data });
    return this.pdfFileRepository.save(newFile);
  }
    
    
   async getFileById(id: number) {
    return this.pdfFileRepository.findOneBy({ id });;
  }
}

