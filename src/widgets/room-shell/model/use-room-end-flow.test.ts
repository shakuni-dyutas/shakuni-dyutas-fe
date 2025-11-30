import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { RoomEventHandlers } from '@/entities/room/model/use-room-events';
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
