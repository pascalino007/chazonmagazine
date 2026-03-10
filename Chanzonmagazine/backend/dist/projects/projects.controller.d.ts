import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly svc;
    constructor(svc: ProjectsService);
    create(dto: any): Promise<import("./entities/project.entity").Project>;
    findAll(active?: string): Promise<import("./entities/project.entity").Project[]>;
    findBySlug(slug: string): Promise<import("./entities/project.entity").Project>;
    findOne(id: number): Promise<import("./entities/project.entity").Project>;
    update(id: number, dto: any): Promise<import("./entities/project.entity").Project>;
    remove(id: number): Promise<void>;
}
