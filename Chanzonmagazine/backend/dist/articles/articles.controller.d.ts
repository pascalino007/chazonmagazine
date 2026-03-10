import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
export declare class ArticlesController {
    private readonly svc;
    constructor(svc: ArticlesService);
    create(dto: CreateArticleDto): Promise<import("./entities/article.entity").Article>;
    findAll(page?: string, limit?: string, status?: string, categoryId?: string): Promise<{
        data: import("./entities/article.entity").Article[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findPublished(page?: string, limit?: string, category?: string): Promise<{
        data: import("./entities/article.entity").Article[];
        total: number;
    }>;
    getStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        totalViews: number;
    }>;
    findBySlug(slug: string): Promise<import("./entities/article.entity").Article>;
    findOne(id: number): Promise<import("./entities/article.entity").Article>;
    update(id: number, dto: Partial<CreateArticleDto>): Promise<import("./entities/article.entity").Article>;
    remove(id: number): Promise<void>;
    toggleLike(id: number, req: any): Promise<{
        liked: boolean;
        count: number;
    }>;
    getLikes(id: number): Promise<number>;
}
