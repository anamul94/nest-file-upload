import { Controller, Get, Param, Post, Res, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage, memoryStorage } from 'multer';
import { PDFDocument } from 'pdf-lib';
import { Readable } from 'typeorm/platform/PlatformTools';


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}


     @Post('pdf')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    console.log("file buffer", file.buffer); // This should now show the buffer content

         const originalSize = file.buffer.length;

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
         const filename = `file-${uniqueSuffix}.pdf`;
         
         const pdfDoc = await PDFDocument.load(file.buffer);

         const compressPdfUnt = await pdfDoc.save()
    const compressedPdfBuffer = Buffer.from(compressPdfUnt);

         // Save the file using the upload service
         const afterSize = compressedPdfBuffer.length;

    const savedFile = await this.uploadService.saveFile(filename, compressedPdfBuffer);

    return { id: savedFile.id, filename: savedFile.filename, originalFileSize:file.buffer.length, afterFileSize:afterSize };
     }
    
     @Get('pdf/:id')
  async getPdfById(@Param('id') id: string, @Response() res) {
    const fileId = parseInt(id, 10);

    try {
      const file = await this.uploadService.getFileById(fileId);
      if (!file) {
        return "Not foound";
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

      const readableStream = new Readable();
      readableStream.push(file.data);
      readableStream.push(null); // Signal the end of the stream

      readableStream.pipe(res);
    } catch (error) {
      console.error('Error retrieving PDF file:', error);
      res.status(500).json({ message: 'Error retrieving PDF file' });
    }
  }
}
