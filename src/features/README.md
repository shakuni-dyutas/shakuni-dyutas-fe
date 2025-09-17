# Features Layer

## 역할

- 사용자 행위 단위의 기능들
- UI + 비즈니스 규칙 + Server Action + useMutation
- 생성/수정/삭제 등의 쓰기 작업 처리

## 구조

```
features/
└── [feature-name]/
    ├── api/     # 쓰기 API 함수 (commitXxx, doXxx)
    ├── model/   # useMutation 훅, 폼 상태, 검증 로직
    ├── ui/      # 기능 관련 UI 컴포넌트
    └── types/   # 기능 관련 타입 정의 (선택적)
```

## 규칙

- **쓰기 중심**: 생성/수정/삭제 등의 변이 작업
- **useMutation 사용**: TanStack Query의 useMutation 훅 활용
- **Server Actions**: Next.js Server Actions 포함 가능
- **Named Export**: default export 금지
- **참조 방향**: shared, entities만 참조 가능

## 예시

```typescript
// features/create-user/api/commitUser.ts
export async function commitUser(userData: CreateUserRequest): Promise<User> {
  // 사용자 생성 API 호출
}

// features/create-user/model/useCreateUser.ts
export function useCreateUser() {
  return useMutation({
    mutationFn: commitUser,
    onSuccess: () => {
      // 성공 처리 로직
    },
  });
}

// features/create-user/ui/CreateUserForm.tsx
export function CreateUserForm() {
  const createUser = useCreateUser();
  // 폼 UI 로직
}
```
