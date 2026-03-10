import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
export declare class CategoriesService {
    private repo;
    constructor(repo: Repository<Category>);
    create(dto: Partial<Category>): Promise<Category>;
    findAll(activeOnly?: boolean): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    update(id: number, dto: Partial<Category>): Promise<Category>;
    remove(id: number): Promise<void>;
}
