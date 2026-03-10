import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Query } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'
import { memoryStorage } from 'multer'

@Controller('upload')
export class UploadController {
  constructor(private readonly svc: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Query('folder') folder = 'images') {
    return this.svc.uploadFile(file, folder)
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[], @Query('folder') folder = 'images') {
    return this.svc.uploadMultiple(files, folder)
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    return this.svc.uploadFile(file, 'audio')
  }
}
