import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
export declare class ProjectsService {
    private repo;
    constructor(repo: Repository<Project>);
    private generateSlug;
    create(dto: Partial<Project>): Promise<Project>;
    findAll(activeOnly?: boolean): Promise<Project[]>;
    findOne(id: number): Promise<Project>;
    findBySlug(slug: string): Promise<Project>;
    update(id: number, dto: Partial<Project>): Promise<Project>;
    remove(id: number): Promise<void>;
}
