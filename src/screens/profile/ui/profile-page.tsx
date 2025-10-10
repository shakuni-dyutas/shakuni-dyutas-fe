function ProfilePage() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="text-center">
        <h1 className="font-semibold text-2xl">내 프로필</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          로그인한 사용자 정보를 보여줄 페이지입니다.
        </p>
      </div>
    </section>
  );
}

export { ProfilePage };
