import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
export declare class BannersService {
    private repo;
    constructor(repo: Repository<Banner>);
    create(dto: Partial<Banner>): Promise<Banner>;
    findAll(activeOnly?: boolean): Promise<Banner[]>;
    findByPosition(position: string): Promise<Banner[]>;
    findOne(id: number): Promise<Banner>;
    update(id: number, dto: Partial<Banner>): Promise<Banner>;
    remove(id: number): Promise<void>;
}
