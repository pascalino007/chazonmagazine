"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL || 'https://api.chazonmagazine.com:3000',
            process.env.DASHBOARD_URL || 'https://api.chazonmagazine.com:3001',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 4444;
    await app.listen(port);
    console.log(`🚀 Chanzon Backend running on https://api.chazonmagazine.com:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map