import { Article } from '../../articles/entities/article.entity';
export declare class Category {
    id: number;
    slug: string;
    name: string;
    description: string;
    color: string;
    isActive: boolean;
    order: number;
    articles: Article[];
    createdAt: Date;
    updatedAt: Date;
}
