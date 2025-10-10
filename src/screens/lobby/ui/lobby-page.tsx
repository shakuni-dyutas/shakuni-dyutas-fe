import { CreateRoomCTA } from '@/widgets/lobby/ui/create-room-cta';

function LobbyPage() {
  return (
    <>
      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">로비 페이지</h1>
          <p className="text-muted-foreground text-sm">로비 정보를 표시할 페이지입니다.</p>
        </header>
      </section>
      <CreateRoomCTA />
    </>
  );
}

export { LobbyPage };
