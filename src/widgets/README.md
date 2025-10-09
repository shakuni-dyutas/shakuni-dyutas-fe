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

## Shadcn 베이스 컴포넌트 활용 가이드

- BottomNavigation, CreateRoomCTA 등 공통 UI는 `shared/ui/button`, `shared/ui/card`에 정의된 shadcn 스타일 베이스 컴포넌트를 사용한다.
- 레이아웃별 커스터마이징이 필요하면 베이스 컴포넌트의 `className`으로 Tailwind 유틸을 추가하고, 인터랙션/접근성 속성은 그대로 유지한다.
- 애니메이션이 필요한 경우 베이스 컴포넌트를 래핑하거나 `Card` 내부에 `CardContent`를 활용해 구조를 분리한다.
- 새로운 위젯에서 공통 스타일이 반복되면 shared/ui 계층에 래퍼를 추가한 뒤 위젯 문서에 사용 가이드를 기록한다.

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
