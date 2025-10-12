import type { Room, RoomFilters } from '@/entities/room/types/room';
import { useRooms } from '@/features/rooms/model/use-rooms';
import { Card, CardContent } from '@/shared/ui/card';
import { RoomCard } from '@/shared/ui/room-card';

interface RoomListProps {
  filters: RoomFilters;
  onEnterRoom?: (roomId: string) => void;
  rooms?: Room[]; // if provided, render these instead of fetching
}

function RoomList({ filters, onEnterRoom, rooms: providedRooms }: RoomListProps) {
  const { data: fetchedRooms, isLoading, error } = useRooms(filters);
  const rooms = providedRooms ?? fetchedRooms;

  if (!providedRooms && isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="animate-pulse">
            <CardContent className="h-28" />
          </Card>
        ))}
      </div>
    );
  }

  if (!providedRooms && error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm">목록을 불러오는 중 오류가 발생했어요.</CardContent>
      </Card>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">표시할 방이 없어요.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {rooms.map((room: Room) => (
        <RoomCard key={room.id} room={room} onEnterRoom={onEnterRoom} />
      ))}
    </div>
  );
}

export type { RoomListProps };
export { RoomList };


