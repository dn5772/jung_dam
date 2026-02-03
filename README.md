# Jung Dam Restaurant Menu Management System

현대적인 한국 음식점의 메뉴 관리 시스템입니다. Next.js 15, React 19, Vercel Blob을 기반으로 구축된 풀스택 웹 애플리케이션입니다.

## 🚀 주요 기능

- **메뉴 관리**: 카테고리별 메뉴 아이템 관리 (추가/수정/삭제)
- **이미지 업로드**: Vercel Blob을 활용한 클라우드 이미지 저장
- **관리자 패널**: JWT 기반 인증 시스템
- **반응형 디자인**: Bootstrap 기반 모바일 최적화 UI
- **이미지 갤러리**: GLightbox를 활용한 팝업 이미지 뷰어
- **실시간 UI 업데이트**: 낙관적 업데이트로 향상된 사용자 경험

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Bootstrap 5, CSS Modules, Animate.css
- **Backend**: Next.js API Routes
- **Database**: Vercel Blob (파일 저장소)
- **Authentication**: JWT + bcrypt
- **Deployment**: Vercel
- **Libraries**:
  - GLightbox (이미지 팝업)
  - AOS (스크롤 애니메이션)
  - DnD Kit (드래그 앤 드롭)

## 📁 프로젝트 구조

```
jung_dam/
├── src/
│   ├── app/
│   │   ├── admin/          # 관리자 페이지
│   │   ├── api/            # API 라우트
│   │   │   ├── auth/       # 인증 API
│   │   │   ├── menu/       # 메뉴 관리 API
│   │   │   └── upload/     # 파일 업로드 API
│   │   ├── css/            # 스타일시트
│   │   ├── globals.css     # 글로벌 스타일
│   │   └── layout.js       # 루트 레이아웃
│   ├── components/         # React 컴포넌트
│   │   ├── MenuSection.js  # 메뉴 표시 컴포넌트
│   │   └── YummyScripts.js # 클라이언트 사이드 스크립트
│   └── data/
│       └── menuData.json   # 메뉴 데이터 (백업용)
├── public/                 # 정적 파일
├── scripts/                # 유틸리티 스크립트
└── package.json
```

## 🚀 시작하기

### 환경 설정

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   `.env` 파일을 생성하고 다음 변수를 설정하세요:
   ```env
   JWT_SECRET=your_jwt_secret_key
   ADMIN_PASSWORD_HASH=your_hashed_password
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

3. **관리자 비밀번호 설정**
   ```bash
   # 비밀번호 해시 생성 (예: 'admin123')
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_password', 10).then(h => console.log(h))"
   ```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 메뉴 데이터 마이그레이션

기존 메뉴 데이터를 Vercel Blob으로 마이그레이션하려면:

```bash
node scripts/blob/migrate-to-blob.js
```

### Vercel 배포

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **프로젝트 배포**
   ```bash
   vercel
   ```

3. **환경 변수 설정**
   Vercel 대시보드에서 다음 환경 변수를 설정하세요:
   - `JWT_SECRET`
   - `ADMIN_PASSWORD_HASH`
   - `BLOB_READ_WRITE_TOKEN`

## 📊 API 엔드포인트

### 메뉴 관리
- `GET /api/menu` - 메뉴 데이터 조회
- `POST /api/menu` - 전체 메뉴 데이터 업데이트 (관리자 전용)
- `PATCH /api/menu` - 메뉴 아이템 추가/수정/삭제 (관리자 전용)

### 인증
- `POST /api/auth/login` - 관리자 로그인

### 파일 업로드
- `POST /api/upload` - 이미지 파일 업로드

## 🔐 관리자 기능

관리자 페이지 (`/admin`)에서 다음 기능을 사용할 수 있습니다:

- 메뉴 카테고리 관리
- 메뉴 아이템 추가/수정/삭제
- 이미지 업로드 및 관리
- 실시간 데이터 동기화

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일과 데스크톱 모두 최적화
- **애니메이션**: AOS 라이브러리를 활용한 부드러운 스크롤 효과
- **이미지 팝업**: GLightbox를 활용한 갤러리 뷰
- **드래그 앤 드롭**: 직관적인 카테고리 재배열
- **낙관적 업데이트**: 빠른 UI 응답성

## 🔍 모니터링 스크립트

### Blob 상태 확인
```bash
node scripts/blob/check-blob-status.js
```

Vercel Blob에 저장된 파일들의 상태를 확인할 수 있습니다.

## 📝 개발 노트

### 보안 고려사항
- JWT 토큰 기반 인증
- bcrypt를 사용한 비밀번호 해싱
- 환경 변수로 민감한 정보 관리

### 성능 최적화
- Next.js App Router 활용
- Vercel Blob을 통한 CDN 이미지 제공
- 코드 스플리팅 및 lazy loading

### 확장성
- 모듈화된 컴포넌트 구조
- RESTful API 디자인
- 클라우드 네이티브 아키텍처

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - React 기반 풀스택 프레임워크
- [Vercel](https://vercel.com/) - 배포 플랫폼 및 Blob 저장소
- [Bootstrap](https://getbootstrap.com/) - CSS 프레임워크
- [GLightbox](https://biati-digital.github.io/glightbox/) - 이미지 라이트박스
