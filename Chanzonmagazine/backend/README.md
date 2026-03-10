# Chanzon Magazine — NestJS Backend

## Stack
- **NestJS 10** + TypeScript
- **MySQL** via TypeORM (`synchronize: true` auto-creates tables)
- **JWT** authentication (admin-only dashboard)
- **AWS S3** for image and audio uploads
- Runs on **port 3001**

## Quick Start

```bash
cd backend
cp .env.example .env        # fill in your values
npm install
npm run start:dev
```

API base URL: `http://localhost:3001/api`

## .env Variables

| Key | Description |
|-----|-------------|
| `PORT` | Server port (default 3001) |
| `DB_HOST/PORT/USERNAME/PASSWORD/NAME` | MySQL connection |
| `JWT_SECRET` | Secret for signing tokens |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Dashboard login |
| `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_S3_BUCKET` | S3 upload |
| `FRONTEND_URL` / `DASHBOARD_URL` | CORS allowed origins |

## API Endpoints

### Auth
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/login` | — |

### Articles (CRUD)
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/articles/published` | — |
| GET | `/api/articles/slug/:slug` | — |
| GET | `/api/articles/stats` | ✓ |
| GET | `/api/articles?page&limit&status&categoryId` | ✓ |
| POST | `/api/articles` | ✓ |
| PUT | `/api/articles/:id` | ✓ |
| DELETE | `/api/articles/:id` | ✓ |
| POST | `/api/articles/:id/like` | — |

### Categories
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/categories?active=true` | — |
| GET | `/api/categories/slug/:slug` | — |
| POST | `/api/categories` | ✓ |
| PUT | `/api/categories/:id` | ✓ |
| DELETE | `/api/categories/:id` | ✓ |

### Banners
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/banners?active=true&position=hero` | — |
| POST | `/api/banners` | ✓ |
| PUT | `/api/banners/:id` | ✓ |
| DELETE | `/api/banners/:id` | ✓ |

### Projects
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/projects?active=true` | — |
| GET | `/api/projects/slug/:slug` | — |
| POST | `/api/projects` | ✓ |
| PUT | `/api/projects/:id` | ✓ |
| DELETE | `/api/projects/:id` | ✓ |

### Transactions / Donations
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/transactions` | — |
| GET | `/api/transactions/stats` | ✓ |
| GET | `/api/transactions?page&limit&status` | ✓ |
| PUT | `/api/transactions/:id` | ✓ |

### Upload (S3)
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/upload/image?folder=images` | ✓ |
| POST | `/api/upload/images` | ✓ |
| POST | `/api/upload/audio` | ✓ |

### Analytics
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/analytics/track` | — |
| GET | `/api/analytics/stats` | ✓ |
| GET | `/api/analytics/articles-per-day?days=30` | ✓ |
| GET | `/api/analytics/articles-per-month` | ✓ |
| GET | `/api/analytics/views-per-day` | ✓ |
| GET | `/api/analytics/likes-per-article` | ✓ |
| GET | `/api/analytics/top-articles` | ✓ |

### Search
| Method | Path |
|--------|------|
| GET | `/api/search?q=query` |
| GET | `/api/search/articles?q=query&category=slug&page=1` |
