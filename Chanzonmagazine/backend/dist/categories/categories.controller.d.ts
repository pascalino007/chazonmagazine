import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly svc;
    constructor(svc: CategoriesService);
    create(dto: any): Promise<import("./entities/category.entity").Category>;
    findAll(active?: string): Promise<import("./entities/category.entity").Category[]>;
    findBySlug(slug: string): Promise<import("./entities/category.entity").Category>;
    findOne(id: number): Promise<import("./entities/category.entity").Category>;
    update(id: number, dto: any): Promise<import("./entities/category.entity").Category>;
    remove(id: number): Promise<void>;
}
