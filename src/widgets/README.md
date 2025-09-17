# Widgets Layer

## 역할

- 여러 feature/entity를 조합한 페이지 구역
- 복합적인 UI 블록들 (헤더, 사이드바, 대시보드 섹션 등)
- 페이지의 주요 구성 요소들을 조립

## 구조

```
widgets/
└── [widget-name]/
    ├── ui/      # 위젯 UI 컴포넌트
    ├── model/   # 위젯 관련 로직 (선택적)
    └── types/   # 위젯 관련 타입 정의 (선택적)
```

## 규칙

- **조합 중심**: 여러 features와 entities를 조합
- **페이지 구성**: 페이지의 주요 블록 단위
- **Named Export**: default export 금지
- **참조 방향**: shared, entities, features 참조 가능

## 예시

```typescript
// widgets/user-dashboard/ui/UserDashboard.tsx
import { UserProfile } from 'entities/user';
import { EditUserForm } from 'features/edit-user';
import { UserStats } from 'features/user-stats';

export function UserDashboard() {
  return (
    <div>
      <UserProfile />
      <UserStats />
      <EditUserForm />
    </div>
  );
}
```
