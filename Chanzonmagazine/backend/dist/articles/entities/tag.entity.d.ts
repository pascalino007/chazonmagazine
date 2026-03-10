import { Article } from './article.entity';
export declare class Tag {
    id: number;
    name: string;
    slug: string;
    articles: Article[];
    createdAt: Date;
}
