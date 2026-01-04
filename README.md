# AI 이미지 생성 비교 플레이그라운드

OpenAI DALL-E 3와 Google Gemini를 사용하여 이미지 생성을 비교하는 Next.js 애플리케이션입니다. 간단한 키워드를 선택하면, AI가 자동으로 사실적인 장면을 묘사하는 프롬프트를 생성하여 두 이미지 생성 모델의 결과를 비교해줍니다.

## 기능

- **키워드 기반 프롬프트 생성**: '직장', '학교' 등의 키워드를 선택하면, GPT-4o-mini가 일상적인 장면에 대한 사실적인 묘사를 생성합니다.
- **OpenAI 이미지 생성**: 생성된 프롬프트를 사용하여 DALL-E 3 API로 이미지를 생성합니다.
- **Gemini 이미지 생성**: 동일한 프롬프트를 사용하여 Gemini API로 이미지를 생성합니다.
- **결과 비교**: 두 API의 결과를 나란히 비교하여 볼 수 있습니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

루트 디렉터리에 `.env.local` 파일을 생성하고 API 키를 설정하세요:

```
OPENAI_API_KEY="your_openai_api_key_here"
GEMINI_API_KEY="your_gemini_api_key_here"
```

#### API 키 발급 방법

**OpenAI API Key:**
1. [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) 방문
2. "Create new secret key" 클릭
3. 생성된 키를 복사하여 `.env.local`에 설정

**Gemini API Key:**
1. [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) 방문
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
│   │   │   ├── route.ts      # OpenAI DALL-E 3 API 엔드포인트
│   │   │   └── chat/
│   │   │       └── route.ts  # 프롬프트 생성을 위한 OpenAI Chat API 엔드포인트
│   │   └── gemini/
│   │       └── route.ts      # Gemini API 엔드포인트
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 메인 페이지 UI
├── .env.local               # 환경 변수 (API 키)
├── next.config.js          # Next.js 설정
└── package.json           # 의존성
```

## 사용 방법

1. '직장', '학교', '거리', '가정' 등 미리 준비된 키워드 버튼 중 하나를 클릭합니다.
2. 클릭과 동시에, 선택된 키워드를 바탕으로 OpenAI Chat API(GPT-4o-mini)가 이미지 생성을 위한 구체적인 프롬프트를 생성합니다.
3. 생성된 프롬프트가 화면에 표시되고, 이 프롬프트를 사용하여 OpenAI와 Gemini 이미지 생성 API가 동시에 호출됩니다.
4. 각 모델이 생성한 이미지가 화면에 나란히 표시되어 결과를 비교할 수 있습니다.

## 사용 모델

| Provider | Model | 역할 |
|----------|-------|------|
| OpenAI | `gpt-4o-mini` | 키워드를 바탕으로 이미지 생성 프롬프트 제안 |
| OpenAI | `dall-e-3` | 1024x1024 고품질 이미지 생성 |
| Google | `gemini-1.5-flash`| Gemini 네이티브 이미지 생성 |

## 주의사항

- **API 비용**: 모든 API는 사용량에 따라 비용이 발생할 수 있습니다.
- **API 키 보안**: `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. 안전하게 관리하세요.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **APIs**: 
  - OpenAI API (DALL-E 3, GPT-4o-mini)
  - Google GenAI (`@google/genai`)
- **Deployment**: Cloudflare Workers

## 라이선스

MIT
