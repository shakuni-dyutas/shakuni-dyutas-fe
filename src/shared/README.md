# Shared Layer

## 역할

- 순수 유틸리티 함수, UI primitives, 설정 파일들
- **도메인 지식 금지**: 비즈니스 로직이나 도메인 특화 로직 포함 불가
- 프로젝트 전반에서 재사용 가능한 범용적인 요소들만 포함

## 구조

```
shared/
├── ui/          # UI primitives (Button, Input 등)
├── lib/         # 순수 유틸리티 함수들 (formatDate, cn 등)
├── hooks/       # 범용 커스텀 훅들
├── types/       # 공통 타입 정의
└── config/      # 설정 및 상수들
```

## 규칙

- **순수 함수**: 사이드 이펙트 없는 입력 → 출력 변환
- **Named Export**: default export 금지
- **배럴 파일 금지**: index.ts 같은 re-export 불허
- **매직 넘버/리터럴 금지**: 의미 있는 상수로 분리
- **참조 방향**: shared는 다른 레이어를 참조하지 않음
