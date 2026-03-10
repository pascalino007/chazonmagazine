import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { ArticleLike } from './entities/article-like.entity';
import { CreateArticleDto } from './dto/create-article.dto';
export declare class ArticlesService {
    private articleRepo;
    private tagRepo;
    private likeRepo;
    constructor(articleRepo: Repository<Article>, tagRepo: Repository<Tag>, likeRepo: Repository<ArticleLike>);
    private generateSlug;
    create(dto: CreateArticleDto): Promise<Article>;
    findAll(page?: number, limit?: number, status?: string, categoryId?: number): Promise<{
        data: Article[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findPublished(page?: number, limit?: number, categorySlug?: string): Promise<{
        data: Article[];
        total: number;
    }>;
    findOne(id: number): Promise<Article>;
    findBySlug(slug: string): Promise<Article>;
    update(id: number, dto: Partial<CreateArticleDto>): Promise<Article>;
    remove(id: number): Promise<void>;
    toggleLike(articleId: number, ipAddress: string): Promise<{
        liked: boolean;
        count: number;
    }>;
    getLikeCount(articleId: number): Promise<number>;
    getStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        totalViews: number;
    }>;
}
