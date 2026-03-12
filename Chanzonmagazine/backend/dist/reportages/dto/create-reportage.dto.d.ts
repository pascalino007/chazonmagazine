export declare class CreateReportageDto {
    title: string;
    shortDescription: string;
    content: string;
    imageUrl?: string;
    imageUrls?: string[];
    audioUrl?: string;
    videoUrl?: string;
    author?: string;
    readTime?: string;
    status?: string;
    categoryId?: number;
    tags?: string[];
}
