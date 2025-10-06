# Google OAuth 설정 가이드

## 개요

- `@react-oauth/google`를 사용해 Authorization Code 플로우를 트리거합니다.
- App Router 전역에서 `GoogleOAuthProvider`가 초기화되며, 로그인 버튼은 `useGoogleOAuth` 훅을 통해 상태/에러를 관리합니다.

## 환경변수

1. Google Cloud Console > OAuth 2.0 Client ID를 발급합니다.
2. 발급된 client ID 값을 `.env.local`에 추가합니다.

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
```

- `NEXT_PUBLIC_` prefix는 클라이언트 컴포넌트에서 접근하기 위한 필수 설정입니다.
- 값이 비어 있으면 로그인 버튼이 비활성화되고 경고 메시지가 노출됩니다.

## 팝업/리디렉션 정책

- 기본 UX는 `popup` 모드입니다. 브라우저가 팝업을 차단하면 "팝업 허용" 안내 메시지가 화면에 출력됩니다.
- 사용자가 팝업을 닫거나 취소하면 "다시 시도" 메시지가 노출됩니다.
- Google 스크립트 로딩 실패 시 콘솔에 에러가 기록되므로, 네트워크/차단 정책을 확인합니다.

## 후속 작업

- Authorization Code를 백엔드에 전달하는 API 연동은 `T-M1-1-3`에서 처리합니다.
- 토큰 저장, 세션 동기화 등의 후속 로직은 추가 태스크에서 다룹니다.
