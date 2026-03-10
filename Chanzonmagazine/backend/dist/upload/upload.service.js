"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor(config) {
        this.config = config;
        this.region = config.get('AWS_REGION', 'eu-west-1');
        this.bucket = config.get('AWS_S3_BUCKET', 'chanzon-media');
        this.s3 = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: config.get('AWS_ACCESS_KEY_ID', ''),
                secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY', ''),
            },
        });
    }
    async uploadFile(file, folder = 'uploads') {
        const ext = file.originalname.split('.').pop();
        const key = `${folder}/${(0, uuid_1.v4)()}.${ext}`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        }));
        const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
        return { url, key };
    }
    async uploadMultiple(files, folder = 'uploads') {
        return Promise.all(files.map((f) => this.uploadFile(f, folder)));
    }
    async deleteFile(key) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map