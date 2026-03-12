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
    const endpoint = config.get('SPACES_ENDPOINT', '')
    if (endpoint) {
      const endpointUrl = new URL(endpoint)
      this.region = endpointUrl.host.split('.')[0] // Extract region from endpoint (e.g., sfo2 from sfo2.digitaloceanspaces.com)
    } else {
      this.region = config.get('SPACES_REGION', 'fra1')
    }
    this.bucket = config.get('SPACES_BUCKET', 'myikigai')
    const accessKeyId = config.get('SPACES_KEY', '')
    const secretAccessKey = config.get('SPACES_SECRET', '')
    if (accessKeyId && secretAccessKey && endpoint) {
      this.s3 = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        endpoint,
        forcePathStyle: false, // Digital Ocean Spaces uses virtual-hosted style
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
      const url = `https://${this.bucket}.${this.region}.cdn.digitaloceanspaces.com/${key}`
      return { url, key }
    } else {
      // For development, return a local URL without uploading
      const url = `https://api.chazonmagazine.com/${key}`
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
