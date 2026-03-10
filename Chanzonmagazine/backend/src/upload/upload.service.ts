import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadService {
  private s3: S3Client
  private bucket: string
  private region: string

  constructor(private config: ConfigService) {
    this.region = config.get('AWS_REGION', 'eu-west-1')
    this.bucket = config.get('AWS_S3_BUCKET', 'chanzon-media')
    const accessKeyId = config.get('AWS_ACCESS_KEY_ID', '')
    const secretAccessKey = config.get('AWS_SECRET_ACCESS_KEY', '')
    if (accessKeyId && secretAccessKey) {
      this.s3 = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    } else {
      this.s3 = null as any
    }
  }

  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<{ url: string; key: string }> {
    const ext = file.originalname.split('.').pop()
    const key = `${folder}/${uuidv4()}.${ext}`

    if (this.s3) {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read' as any,
        }),
      )
      const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
      return { url, key }
    } else {
      // For development, return a local URL without uploading
      const url = `http://localhost:4444/${key}`
      return { url, key }
    }
  }

  async uploadMultiple(files: Express.Multer.File[], folder = 'uploads'): Promise<Array<{ url: string; key: string }>> {
    return Promise.all(files.map((f) => this.uploadFile(f, folder)))
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }
}
