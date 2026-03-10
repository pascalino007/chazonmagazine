import { Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { Category } from '../categories/entities/category.entity';
import { Project } from '../projects/entities/project.entity';
export declare class SearchService {
    private articleRepo;
    private categoryRepo;
    private projectRepo;
    constructor(articleRepo: Repository<Article>, categoryRepo: Repository<Category>, projectRepo: Repository<Project>);
    search(query: string, limit?: number): Promise<{
        articles: any[];
        categories: any[];
        projects: any[];
        total?: undefined;
    } | {
        articles: Article[];
        categories: Category[];
        projects: Project[];
        total: number;
    }>;
    searchArticles(query: string, categorySlug?: string, page?: number, limit?: number): Promise<{
        data: Article[];
        total: number;
        page: number;
        lastPage: number;
    }>;
}
