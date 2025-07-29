# JobBot Web Platform (PpoSeek)

해당 웹 플랫폼은 Next.js 기반의 구인구직 플랫폼입니다.

## 시작하기

### 1. Node.js 설치
- [Node.js 공식 웹사이트](https://nodejs.org)에서 **LTS 버전** 다운로드 및 설치
- 설치 확인: `node --version` 및 `npm --version`

### 2. 프로젝트 클론
```bash
git clone <repository-url>
cd jobbot-web-platform
```

### 3. 의존성 설치
```bash
npm install
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 브라우저에서 확인
- **로컬**: http://localhost:3000
- **네트워크**: http://[네트워크-IP]:3000 (같은 Wi-Fi의 다른 기기에서 접근 가능)

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | 코드 린팅 |

## 문제 해결

### Windows에서 `npm` 명령어가 인식되지 않는 경우
1. PowerShell을 관리자 권한으로 실행
2. 다음 명령어 실행:
```powershell
# 임시 해결책
$env:PATH += ";C:\Program Files\nodejs"

# 영구 해결책 (관리자 권한 필요)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs", [EnvironmentVariableTarget]::Machine)
```

### 전체 경로로 실행하기
```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## 기술 스택
- **프레임워크**: Next.js 15.2.4
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Radix UI
- **상태 관리**: React Hook Form
- **아이콘**: Lucide React

## 프로젝트 구조
```
├── app/                 # Next.js App Router 페이지
├── components/          # 재사용 가능한 컴포넌트
├── contexts/           # React Context
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 함수
├── public/             # 정적 파일
└── styles/             # 전역 스타일
```

## 배포

### 로컬 빌드 테스트
```bash
npm run build
npm run start
```

### Azure App Service 배포
1. **Azure Portal**에서 App Service 생성
2. **Deployment Center**에서 GitHub 연결
3. **Configuration**에서 환경 변수 설정:
   - `NODE_ENV=production`
   - `WEBSITE_NODE_DEFAULT_VERSION=20.x`
4. **Application Settings**에서 빌드 명령어 확인:
   - Build Command: `npm run build`
   - Start Command: `npm start`

### 일반 배포
```bash
npm run build
npm run start
```

### 문제 해결
- **"next: not found" 에러**: `postinstall` 스크립트가 자동으로 빌드를 실행합니다
- **빌드 실패**: `npm run build`를 먼저 로컬에서 테스트해보세요

---
해당 README 문서를 통해 로컬에서 프론트 페이지를 실행할 수 있습니다.