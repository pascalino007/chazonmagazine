import { Article } from './article.entity';
export declare class ArticleLike {
    id: number;
    ipAddress: string;
    sessionId: string;
    article: Article;
    articleId: number;
    createdAt: Date;
}
