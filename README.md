# AIncide

Next.js 기반 커뮤니티 플랫폼

## Features

- **게시글 작성** - 마크다운 지원, 이미지 업로드
- **댓글 시스템** - 중첩 댓글, 실시간 업데이트
- **투표 기능** - 게시글 및 댓글에 추천/비추천
- **TODO 관리** - 개인 할 일 목록 관리
- **토큰 사용량 모니터링** - [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) 연동으로 계정별 사용량 추적

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Turso (LibSQL) + Prisma 7
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
npm install
```

### Environment Variables

Create `.env` file in the project root:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes (dev) | SQLite 파일 경로 (로컬 개발용) |
| `TURSO_DATABASE_URL` | Yes (prod) | Turso 데이터베이스 URL |
| `TURSO_AUTH_TOKEN` | Yes (prod) | Turso 인증 토큰 |
| `CLIPROXY_URL` | No | CLIProxyAPI 서버 URL |
| `CLIPROXY_MANAGEMENT_KEY` | No | CLIProxyAPI 관리 API 키 |

See `.env.example` for reference.

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (dev)
npx prisma migrate dev

# Run migrations (prod)
npx prisma migrate deploy
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

```bash
npm run build
npm start
```

## Customization

### 외부 링크 추가

`src/lib/constants.ts`에서 헤더/푸터 링크를 수정할 수 있습니다.

```typescript
export const EXTERNAL_LINKS = {
  github: 'https://github.com/yourusername/aincide',
  discord: 'https://discord.gg/yourserver',
}
```

### CLIProxyAPI 연동

[CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI)를 연동하면 Status 페이지에서 AI 서비스 계정별 토큰 사용량을 모니터링할 수 있습니다.

```env
CLIPROXY_URL="http://localhost:8317"
CLIPROXY_MANAGEMENT_KEY="your-management-key"
```

설정하지 않으면 Status 페이지에 설정 가이드가 표시됩니다.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.
