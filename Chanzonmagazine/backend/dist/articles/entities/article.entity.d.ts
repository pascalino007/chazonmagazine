import { Category } from '../../categories/entities/category.entity';
import { Tag } from './tag.entity';
import { ArticleLike } from './article-like.entity';
export declare class Article {
    id: number;
    slug: string;
    title: string;
    shortDescription: string;
    content: string;
    imageUrl: string;
    imageUrls: string[];
    audioUrl: string;
    videoUrl: string;
    author: string;
    readTime: string;
    status: string;
    viewCount: number;
    category: Category;
    categoryId: number;
    tags: Tag[];
    likes: ArticleLike[];
    createdAt: Date;
    updatedAt: Date;
}
