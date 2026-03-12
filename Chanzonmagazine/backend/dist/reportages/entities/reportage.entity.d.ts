import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../articles/entities/tag.entity';
export declare class Reportage {
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
    createdAt: Date;
    updatedAt: Date;
}
