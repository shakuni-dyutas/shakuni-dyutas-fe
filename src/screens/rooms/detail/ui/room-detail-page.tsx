interface RoomDetailPageProps {
  roomId: string;
}

function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10">
      <h1 className="font-semibold text-2xl">방 정보를 준비 중이에요.</h1>
      <p className="text-muted-foreground text-sm">
        실제 방 상세화면은 곧 제공될 예정입니다. 현재는
        <span className="font-medium">{roomId}</span> 방으로 이동한 상태이며, 필요한 데이터 연동이
        완료되면 이 영역에서 진행 현황과 참여 정보를 확인할 수 있어요.
      </p>
    </section>
  );
}

export { RoomDetailPage };
export type { RoomDetailPageProps };
