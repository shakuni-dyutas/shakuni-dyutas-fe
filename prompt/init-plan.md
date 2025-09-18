# 🚀 Shakuni-Dyutas 프론트엔드 베이스 구축 계획

## 📋 1단계: 프로젝트 초기 세팅

- [x] **Next.js 프로젝트 생성**
  - [x] `npx create-next-app@latest . --typescript --tailwind --eslint --app` 실행
  - [x] 기본 의존성 설치 확인 (React, Next.js, TypeScript, Tailwind CSS)
  - [x] 기본 폴더 구조 확인 (`app/`, `public/`, 설정 파일들)

## 📁 2단계: FSD 아키텍처 기반 폴더 구조 생성

- [x] **src 디렉토리 생성 및 기본 구조 설정**

  - [x] `src/` 루트 디렉토리 생성
  - [x] 기존 `app/` 폴더를 `src/app/`로 이동

- [x] **FSD 계층별 폴더 구조 생성**

  - [x] `src/shared/` - 공통 요소들
    - [x] `src/shared/ui/` - 공통 UI 컴포넌트
    - [x] `src/shared/lib/` - 유틸리티 함수들
    - [x] `src/shared/hooks/` - 커스텀 훅들
    - [x] `src/shared/types/` - 공통 타입 정의
    - [x] `src/shared/config/` - 설정 및 상수들 (constants → config로 변경)
  - [x] `src/entities/` - 비즈니스 엔티티
  - [x] `src/features/` - 기능별 모듈
  - [x] `src/widgets/` - 복합 UI 블록
  - [x] `src/pages/` - 페이지별 컴포넌트

- [x] **기본 파일들 생성 (rules.md 반영: 배럴 파일 금지)**
  - [x] `src/shared/config/constants.ts` - 공용 상수 정의 (매직 넘버/리터럴 금지)
  - [x] `src/shared/types/common.ts` - 공통 타입 정의 (interface 기본, 유니온은 type)
  - [x] `src/shared/lib/utils.ts` - 순수 유틸리티 함수들 (cn, formatDate 등)
  - [x] 각 계층별 README.md 파일로 역할과 규칙 문서화

## ⚙️ 3단계: 기본 설정 파일 구성

- [ ] **TypeScript 설정 업데이트**

  - [ ] `tsconfig.json`에 경로 별칭(path mapping) 설정
  - [ ] `@/shared/*`, `@/entities/*`, `@/features/*` 등 별칭 추가
  - [ ] 절대 경로 import 설정

- [ ] **Next.js 설정 업데이트**

  - [ ] `next.config.ts` 기본 설정 최적화
  - [ ] 실험적 기능 설정 (필요시)

- [ ] **기본 폴더 구조 테스트**
  - [ ] 각 폴더에서 import/export가 정상 동작하는지 확인
  - [ ] 경로 별칭이 정상 작동하는지 테스트

## 🔧 4단계: 라이브러리 및 도구 설정 (추후 진행)

- [x] **개발 도구 설정**

  - [x] Biome 설정 (린터 & 포매터)
  - [x] Husky + lint-staged 설정
  - [x] 커밋 컨벤션 설정

- [x] **UI 라이브러리 설정**

  - [x] Shadcn/ui 설치 및 설정
  - [x] Tweakcn 스타일 적용

- [x] **상태 관리 및 데이터 페칭**

  - [x] Tanstack Query 설정
  - [x] Zustand 설정
  - [x] MSW (Mock Service Worker) 설정

- [x] **폼 및 검증**

  - [x] React Hook Form 설정
  - [x] Zod 스키마 검증 라이브러리 설정

<!-- TODO
- [ ] **테스팅 및 스토리북**

  - [ ] Vitest 설정
  - [ ] Playwright 설정
  - [ ] Storybook 설정

- [ ] **인증**
  - [ ] Google OAuth 설정

-->

---

## 📝 진행 상황

- **완료된 단계**: 1단계 (프로젝트 초기 세팅), 2단계 (FSD 폴더 구조 생성), 4단계 (라이브러리 및 도구 설정)
- **현재 진행**: 3단계 (기본 설정 파일 구성)
- **다음 예정**: 3단계 마무리 및 추가 도구 도입

## 📌 참고사항

- FSD(Feature-Sliced Design) 아키텍처 원칙 준수
- 코딩 컨벤션: 컴포넌트(PascalCase), 훅(camelCase), 변수(snake_case), 함수(camelCase)
- 모든 설정 파일은 프로젝트 요구사항에 맞게 커스터마이징
