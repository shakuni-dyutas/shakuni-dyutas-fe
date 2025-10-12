import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { CREATE_ROOM_MAX_FACTION_COUNT } from '@/features/rooms/create/model/create-room-form-schema';
import { server } from '@/shared/mocks/server';
import { OverlayRootProvider } from '@/shared/providers/overlay-provider';
import { CreateRoomPanel } from './create-room-panel';

const replaceMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const activeQueryClients: QueryClient[] = [];

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

function renderWithQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  activeQueryClients.push(client);

  return render(
    <OverlayRootProvider>
      <QueryClientProvider client={client}>
        <CreateRoomPanel />
      </QueryClientProvider>
    </OverlayRootProvider>,
  );
}

describe('CreateRoomPanel', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  afterEach(() => {
    activeQueryClients.forEach((client) => {
      client.clear();
    });
    activeQueryClients.length = 0;
    server.resetHandlers();
  });

  test('기본 섹션과 필드를 렌더링한다', () => {
    renderWithQueryClient();

    expect(screen.getByRole('heading', { name: '기본 정보' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '공개 설정' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '진영 구성' })).toBeInTheDocument();
    expect(screen.getByLabelText(/방 제목/)).toBeInTheDocument();
    expect(screen.getByLabelText(/진영 이름/)).toBeInTheDocument();
  });

  test('필수 입력을 비운 채 제출하면 검증 오류를 노출한다', async () => {
    renderWithQueryClient();

    const submitButton = screen.getByRole('button', { name: '방 생성' });
    expect(submitButton).toBeDisabled();

    await act(async () => {
      fireEvent.submit(screen.getByTestId('create-room-form'));
    });

    await waitFor(() => {
      expect(screen.getByText('방 제목을 입력해 주세요.')).toBeInTheDocument();
    });
    expect(screen.getByText('제한 시간을 입력해 주세요.')).toBeInTheDocument();
    expect(screen.getByText('최소 배팅 포인트를 입력해 주세요.')).toBeInTheDocument();

    expect(screen.getAllByText('진영 이름을 입력해 주세요.')[0]).toBeInTheDocument();
    expect(screen.getAllByText('진영 설명을 입력해 주세요.')[0]).toBeInTheDocument();
  });

  test('비공개 전환 시 비밀번호 입력이 나타났다가 공개로 돌아오면 숨겨진다', async () => {
    const user = userEvent.setup();
    renderWithQueryClient();

    expect(screen.queryByLabelText('방 비밀번호')).not.toBeInTheDocument();

    const [privateRadio] = screen.getAllByRole('radio', { name: /비공개방/ });
    await user.click(privateRadio);
    expect(screen.getByLabelText('방 비밀번호')).toBeInTheDocument();

    const [publicRadio] = screen.getAllByRole('radio', { name: /공개방/ });
    await user.click(publicRadio);
    expect(screen.queryByLabelText('방 비밀번호')).not.toBeInTheDocument();
  });

  test('비공개 상태에서 비밀번호 없이 제출하면 오류 메시지를 표시한다', async () => {
    const user = userEvent.setup();
    renderWithQueryClient();

    await user.type(screen.getByLabelText(/방 제목/), '비공개 방');
    await user.type(screen.getByLabelText(/제한 시간/), '45');
    await user.type(screen.getByLabelText(/최소 배팅 포인트/), '200');
    await user.type(screen.getByLabelText(/진영 이름/), '진영 A');
    await user.type(screen.getByLabelText(/진영 설명/), '설명');

    const [privateRadio] = screen.getAllByRole('radio', { name: /비공개방/ });
    await user.click(privateRadio);

    const submitButton = screen.getByRole('button', { name: '방 생성' });
    expect(submitButton).toBeDisabled();

    await act(async () => {
      fireEvent.submit(screen.getByTestId('create-room-form'));
    });

    await waitFor(() => {
      expect(screen.getByText('비공개 방의 비밀번호를 입력해 주세요.')).toBeInTheDocument();
    });
  });

  test('진영을 추가하고 제거할 수 있다', async () => {
    const user = userEvent.setup();
    renderWithQueryClient();

    expect(screen.getAllByText(/진영 #/)).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: '진영 추가' }));
    expect(screen.getAllByText(/진영 #/)).toHaveLength(2);

    const [removeButton] = screen.getAllByRole('button', { name: /제거/ });
    await user.click(removeButton);
    expect(screen.getAllByText(/진영 #/)).toHaveLength(1);
  });

  test('진영 최대 개수에 도달하면 추가 버튼이 비활성화된다', async () => {
    const user = userEvent.setup();
    renderWithQueryClient();

    const addButton = screen.getByRole('button', { name: '진영 추가' });

    for (let i = 1; i < CREATE_ROOM_MAX_FACTION_COUNT; i += 1) {
      await user.click(addButton);
    }

    expect(screen.getAllByText(/진영 #/)).toHaveLength(CREATE_ROOM_MAX_FACTION_COUNT);
    expect(addButton).toBeDisabled();
  });

  test('유효한 데이터를 입력하면 방 생성 API 성공 흐름을 처리한다', async () => {
    const user = userEvent.setup();
    renderWithQueryClient();

    await user.type(screen.getByLabelText(/방 제목/), '테스트 방');
    await user.type(screen.getByLabelText(/제한 시간/), '30');
    await user.type(screen.getByLabelText(/최소 배팅 포인트/), '100');
    await user.type(screen.getByLabelText(/진영 이름/), '진영 A');
    await user.type(screen.getByLabelText(/진영 설명/), '진영 설명입니다.');

    const submitButton = screen.getByRole('button', { name: '방 생성' });
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    const confirmDialog = await screen.findByRole('alertdialog');
    expect(confirmDialog).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '생성하기' }));

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith('방 생성이 완료되었어요.');
    });

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/rooms/room-1234');
    });
  });

  test('redirectPath가 없으면 roomId 기반 경로로 이동한다', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('*/rooms', async () =>
        HttpResponse.json(
          {
            roomId: 'room-5678',
          },
          { status: 201 },
        ),
      ),
    );

    renderWithQueryClient();

    await user.type(screen.getByLabelText(/방 제목/), '기본 경로 테스트');
    await user.type(screen.getByLabelText(/제한 시간/), '20');
    await user.type(screen.getByLabelText(/최소 배팅 포인트/), '50');
    await user.type(screen.getByLabelText(/진영 이름/), '기본 진영');
    await user.type(screen.getByLabelText(/진영 설명/), '설명');

    await user.click(screen.getByRole('button', { name: '방 생성' }));
    await user.click(await screen.findByRole('button', { name: '생성하기' }));

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith('방 생성이 완료되었어요.');
    });

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/rooms/room-5678');
    });
  });

  test('API가 실패하면 토스트로 오류 메시지를 안내한다', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('*/rooms', () =>
        HttpResponse.json(
          { message: '방 생성에 실패했어요.' },
          {
            status: 500,
          },
        ),
      ),
    );

    renderWithQueryClient();

    await user.type(screen.getByLabelText(/방 제목/), '에러 방');
    await user.type(screen.getByLabelText(/제한 시간/), '45');
    await user.type(screen.getByLabelText(/최소 배팅 포인트/), '200');
    await user.type(screen.getByLabelText(/진영 이름/), '진영 A');
    await user.type(screen.getByLabelText(/진영 설명/), '진영 설명입니다.');

    const submitButton = screen.getByRole('button', { name: '방 생성' });
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    await screen.findByRole('alertdialog');

    await user.click(screen.getByRole('button', { name: '생성하기' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('방 생성에 실패했어요.');
    });

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('제출 확인 모달에서 취소하면 방 생성 흐름을 중단한다', async () => {
    const user = userEvent.setup();
    renderWithQueryClient();

    await user.type(screen.getByLabelText(/방 제목/), '취소 테스트 방');
    await user.type(screen.getByLabelText(/제한 시간/), '15');
    await user.type(screen.getByLabelText(/최소 배팅 포인트/), '50');
    await user.type(screen.getByLabelText(/진영 이름/), '진영 취소');
    await user.type(screen.getByLabelText(/진영 설명/), '설명');

    const submitButton = screen.getByRole('button', { name: '방 생성' });
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    const confirmDialog = await screen.findByRole('alertdialog');
    expect(confirmDialog).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => {
      expect(toastSuccessMock).not.toHaveBeenCalled();
      expect(toastErrorMock).not.toHaveBeenCalled();
      expect(replaceMock).not.toHaveBeenCalled();
    });
  });
});
