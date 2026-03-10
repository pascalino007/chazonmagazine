import { SearchService } from './search.service';
export declare class SearchController {
    private readonly svc;
    constructor(svc: SearchService);
    search(q: string, limit?: string): Promise<{
        articles: any[];
        categories: any[];
        projects: any[];
        total?: undefined;
    } | {
        articles: import("../articles/entities/article.entity").Article[];
        categories: import("../categories/entities/category.entity").Category[];
        projects: import("../projects/entities/project.entity").Project[];
        total: number;
    }>;
    searchArticles(q: string, category?: string, page?: string, limit?: string): Promise<{
        data: import("../articles/entities/article.entity").Article[];
        total: number;
        page: number;
        lastPage: number;
    }>;
}
