import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly svc;
    constructor(svc: UploadService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        key: string;
    }>;
    uploadImages(files: Express.Multer.File[], folder?: string): Promise<{
        url: string;
        key: string;
    }[]>;
    uploadAudio(file: Express.Multer.File): Promise<{
        url: string;
        key: string;
    }>;
}
