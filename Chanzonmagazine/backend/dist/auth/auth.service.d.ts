import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private jwtService;
    private config;
    constructor(jwtService: JwtService, config: ConfigService);
    login(username: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    validateToken(token: string): Promise<any>;
}
