import { CreateRoomCTA } from '@/widgets/lobby/ui/create-room-cta';

function LobbyPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 pb-[calc(env(safe-area-inset-bottom,0px)+7.5rem)]">
      <section className="flex flex-col gap-6 px-4 py-10 text-left">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">로비 페이지</h1>
          <p className="text-sm text-muted-foreground">로비 정보를 표시할 페이지입니다.</p>
        </header>
      </section>
      <CreateRoomCTA />
    </div>
  );
}

export { LobbyPage };
