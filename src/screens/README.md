# Screens Layer

## 역할

- 페이지별 컴포넌트들
- 여러 widgets를 조합하여 완전한 페이지를 구성
- 페이지 레벨의 상태 관리와 레이아웃
- Next.js pages router와 충돌 되지 않도록 screens 폴더로 구성

## 구조

```
screens/
└── [page-name]/
    ├── ui/      # 페이지 UI 컴포넌트
    ├── model/   # 페이지 관련 로직 (선택적)  
    └── types/   # 페이지 관련 타입 정의 (선택적)
```

## 규칙

- **페이지 조합**: widgets들을 조합하여 완전한 페이지 구성
- **레이아웃 관리**: 페이지 레벨의 레이아웃과 상태 관리
- **Named Export**: default export 금지
- **참조 방향**: 모든 하위 레이어 참조 가능 (shared, entities, features, widgets)

## 예시

```typescript
// screens/user-management/ui/UserManagementPage.tsx
import { UserDashboard } from 'widgets/user-dashboard';
import { UserList } from 'widgets/user-list';

export function UserManagementPage() {
  return (
    <main>
      <h1>사용자 관리</h1>
      <UserDashboard />
      <UserList />
    </main>
  );
}
```

## 참고

- Next.js App Router의 `app/` 디렉토리에서 이 screens 컴포넌트들을 import하여 사용
- 실제 라우팅은 `app/` 디렉토리에서 처리

