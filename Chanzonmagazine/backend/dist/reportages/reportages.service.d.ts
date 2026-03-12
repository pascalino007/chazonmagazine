import { Repository } from 'typeorm';
import { Reportage } from './entities/reportage.entity';
import { Tag } from '../articles/entities/tag.entity';
import { CreateReportageDto } from './dto/create-reportage.dto';
export declare class ReportagesService {
    private reportageRepo;
    private tagRepo;
    constructor(reportageRepo: Repository<Reportage>, tagRepo: Repository<Tag>);
    private generateSlug;
    create(dto: CreateReportageDto): Promise<Reportage>;
    findAll(page?: number, limit?: number, status?: string, categoryId?: number): Promise<{
        data: Reportage[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findPublished(page?: number, limit?: number, categorySlug?: string): Promise<{
        data: Reportage[];
        total: number;
    }>;
    findOne(id: number): Promise<Reportage>;
    findBySlug(slug: string): Promise<Reportage>;
    update(id: number, dto: Partial<CreateReportageDto>): Promise<Reportage>;
    remove(id: number): Promise<void>;
    getStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        totalViews: number;
    }>;
}
