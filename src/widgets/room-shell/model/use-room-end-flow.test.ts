import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { RoomEventHandlers } from '@/entities/room/model/use-room-events';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import { ROUTE_PATHS } from '@/shared/config/constants';
import { useRoomEndFlow } from './use-room-end-flow';

const replaceMock = vi.fn();
const handlersRef: { current: RoomEventHandlers | null } = { current: null };
const toastInfoMock = vi.fn();
const toastSuccessMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock('@/entities/room/model/use-room-events', () => ({
  useRoomEvents: (_roomId: string | null, handlers: RoomEventHandlers) => {
    handlersRef.current = handlers;
    return { connectionState: 'open', lastError: null };
  },
}));

vi.mock('sonner', () => ({
  toast: {
    info: (...args: unknown[]) => toastInfoMock(...args),
    success: (...args: unknown[]) => toastSuccessMock(...args),
  },
}));

describe('useRoomEndFlow', () => {
  beforeEach(() => {
    handlersRef.current = null;
    replaceMock.mockReset();
  });

  afterEach(() => {
    toastInfoMock.mockReset();
    toastSuccessMock.mockReset();
  });

  test('초기 room detail이 종료 상태면 종료 UI를 즉시 노출한다', async () => {
    const roomDetail = { id: 'room-1', ended: true } as unknown as RoomDetail;

    const { result } = renderHook(() => useRoomEndFlow('room-1', roomDetail));

    await waitFor(() => {
      expect(result.current.endedInfo).toEqual({
        roomId: 'room-1',
        resultPath: ROUTE_PATHS.ROOM_RESULT('room-1'),
      });
    });
  });

  test('room-ending 이벤트로 토스트를 띄우고 종료 알림 상태를 업데이트한다', () => {
    const { result } = renderHook(() => useRoomEndFlow('room-1'));

    act(() => {
      handlersRef.current?.onRoomEnding?.({
        endsAt: '2025-12-01T00:00:00.000Z',
        endsInSeconds: 120,
      });
    });

    expect(result.current.endingNotice).toEqual({
      endsAt: '2025-12-01T00:00:00.000Z',
      endsInSeconds: 120,
    });
    expect(result.current.endedInfo).toBeNull();
    expect(toastInfoMock).toHaveBeenCalled();
  });

  test('room-ended 이벤트로 토스트를 띄우고 수동 CTA로만 이동한다', () => {
    const { result } = renderHook(() => useRoomEndFlow('room-1'));

    act(() => {
      handlersRef.current?.onRoomEnded?.({
        roomId: 'room-1',
        resultPath: '/rooms/room-1/result',
      });
    });

    expect(result.current.endingNotice).toBeNull();
    expect(result.current.endedInfo).toEqual({
      roomId: 'room-1',
      resultPath: '/rooms/room-1/result',
    });
    expect(toastSuccessMock).toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();

    act(() => {
      result.current.handleViewResult();
    });
    expect(replaceMock).toHaveBeenCalledWith('/rooms/room-1/result');
  });
});
