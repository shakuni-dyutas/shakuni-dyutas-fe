function ProfilePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/10 px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">내 프로필</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          로그인한 사용자 정보를 보여줄 페이지입니다.
        </p>
      </div>
    </main>
  );
}

export { ProfilePage };
