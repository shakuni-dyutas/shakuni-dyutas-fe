# Entities Layer

## 역할

- 도메인 개체(Entity) 관련 로직
- 타입 정의, 조회 API, 읽기 전용 useQuery 훅들
- 비즈니스 엔티티의 순수한 데이터 모델과 조회 로직

## 구조

```
entities/
└── [entity-name]/
    ├── api/     # 네트워크 호출 함수 (getXxx, fetchXxx)
    ├── model/   # useQuery 훅, 도메인 규칙
    ├── types/   # 엔티티 타입 정의
    └── ui/      # 엔티티 관련 UI 컴포넌트 (선택적)
```

## 규칙

- **읽기 전용**: 조회(GET) API와 useQuery만 포함
- **쓰기 작업 금지**: 생성/수정/삭제는 features 레이어에서 처리
- **Named Export**: default export 금지
- **참조 방향**: shared만 참조 가능, features/widgets/app 참조 금지

## 예시

```typescript
// entities/user/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// entities/user/api/getUser.ts
export async function getUser(id: string): Promise<User> {
  // API 호출 로직
}

// entities/user/model/useGetUser.ts
export function useGetUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  });
}
```
