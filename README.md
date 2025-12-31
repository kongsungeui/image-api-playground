# AI 이미지 생성 비교 플레이그라운드

OpenAI DALL-E 3와 Google Gemini를 사용하여 이미지 생성을 비교하는 Next.js 애플리케이션입니다.

## 기능

- 사용자로부터 최대 200자의 텍스트 프롬프트 입력
- OpenAI DALL-E 3 API를 통한 이미지 생성
- Google Gemini 2.5 Flash Image를 통한 이미지 생성
- 두 API의 결과를 나란히 비교

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일에 API 키를 설정하세요:

```
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

#### API 키 발급 방법

**OpenAI API Key:**
1. https://platform.openai.com/api-keys 방문
2. "Create new secret key" 클릭
3. 생성된 키를 복사하여 `.env.local`에 설정

**Gemini API Key:**
1. https://aistudio.google.com/app/apikey 방문
2. "Create API key" 클릭
3. 생성된 키를 복사하여 `.env.local`에 설정

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
image-api-playground/
├── app/
│   ├── api/
│   │   ├── openai/
│   │   │   └── route.ts      # OpenAI DALL-E 3 API endpoint
│   │   └── gemini/
│   │       └── route.ts      # Gemini 2.5 Flash Image API endpoint
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page with UI
├── .env.local               # Environment variables (API keys)
├── next.config.js          # Next.js configuration
└── package.json           # Dependencies
```

## 사용 방법

1. 텍스트 입력란에 이미지를 생성할 프롬프트를 입력합니다 (최대 200자)
2. "이미지 생성" 버튼을 클릭합니다
3. OpenAI와 Gemini가 동시에 API 호출을 시작합니다
4. 생성된 이미지가 화면에 나란히 표시됩니다

## 사용 모델

| Provider | Model | 설명 |
|----------|-------|------|
| OpenAI | `dall-e-3` | 1024x1024 고품질 이미지 생성 |
| Google | `gemini-2.5-flash-image` | Gemini 네이티브 이미지 생성 |

## 주의사항

- **API 비용**: 두 API 모두 사용량에 따라 비용이 발생할 수 있습니다.
- **API 키 보안**: `.env.local` 파일은 `.gitignore`에 포함되어 있어 git에 커밋되지 않습니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **APIs**: 
  - OpenAI API (DALL-E 3)
  - Google GenAI (`@google/genai`)

## 라이선스

MIT
