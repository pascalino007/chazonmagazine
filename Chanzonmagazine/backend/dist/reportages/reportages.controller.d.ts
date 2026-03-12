import { ReportagesService } from './reportages.service';
import { CreateReportageDto } from './dto/create-reportage.dto';
export declare class ReportagesController {
    private readonly svc;
    constructor(svc: ReportagesService);
    create(dto: CreateReportageDto): Promise<import("./entities/reportage.entity").Reportage>;
    findAll(page?: string, limit?: string, status?: string, categoryId?: string): Promise<{
        data: import("./entities/reportage.entity").Reportage[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findPublished(page?: string, limit?: string, category?: string): Promise<{
        data: import("./entities/reportage.entity").Reportage[];
        total: number;
    }>;
    getStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        totalViews: number;
    }>;
    findBySlug(slug: string): Promise<import("./entities/reportage.entity").Reportage>;
    findOne(id: number): Promise<import("./entities/reportage.entity").Reportage>;
    update(id: number, dto: Partial<CreateReportageDto>): Promise<import("./entities/reportage.entity").Reportage>;
    remove(id: number): Promise<void>;
}
