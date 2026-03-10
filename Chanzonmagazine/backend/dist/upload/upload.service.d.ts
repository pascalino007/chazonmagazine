import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private config;
    private s3;
    private bucket;
    private region;
    constructor(config: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        key: string;
    }>;
    uploadMultiple(files: Express.Multer.File[], folder?: string): Promise<Array<{
        url: string;
        key: string;
    }>>;
    deleteFile(key: string): Promise<void>;
}
