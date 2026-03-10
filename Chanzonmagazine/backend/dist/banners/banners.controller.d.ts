import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly svc;
    constructor(svc: BannersService);
    create(dto: any): Promise<import("./entities/banner.entity").Banner>;
    findAll(active?: string, position?: string): Promise<import("./entities/banner.entity").Banner[]>;
    findOne(id: number): Promise<import("./entities/banner.entity").Banner>;
    update(id: number, dto: any): Promise<import("./entities/banner.entity").Banner>;
    remove(id: number): Promise<void>;
}
