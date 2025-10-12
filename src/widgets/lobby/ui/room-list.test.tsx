import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { Room } from '@/entities/room/types/room';
import { RoomList } from './room-list';

const rooms: Room[] = [
  {
    id: '1',
    title: 'One',
    description: 'Desc',
    team_a: 'A',
    team_b: 'B',
    participants: 10,
    max_participants: 100,
    time_left: '1h',
    total_betting: 1000,
    team_a_ratio: 50,
    team_b_ratio: 50,
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

describe('RoomList', () => {
  test('rooms prop이 주어지면 해당 목록을 렌더링한다', () => {
    render(<RoomList filters={{ view: 'active' }} rooms={rooms} />);

    expect(screen.getByRole('button', { name: 'enter-room' })).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  test('rooms prop이 비어있으면 빈 상태를 렌더링한다', () => {
    render(<RoomList filters={{ view: 'active' }} rooms={[]} />);

    expect(screen.getByText('표시할 방이 없어요.')).toBeInTheDocument();
  });
});


