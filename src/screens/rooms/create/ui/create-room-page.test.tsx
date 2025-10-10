import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { CreateRoomPage } from './create-room-page';

describe('CreateRoomPage', () => {
  test('기본 섹션과 필드를 렌더링한다', () => {
    render(<CreateRoomPage />);

    expect(screen.getByRole('heading', { name: '기본 정보' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '공개 설정' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '진영 구성' })).toBeInTheDocument();
    expect(screen.getByLabelText('방 제목')).toBeInTheDocument();
    expect(screen.getByLabelText('진영 이름')).toBeInTheDocument();
  });

  test('비공개 전환 시 비밀번호 입력이 나타났다가 공개로 돌아오면 숨겨진다', async () => {
    const user = userEvent.setup();
    render(<CreateRoomPage />);

    expect(screen.queryByLabelText('방 비밀번호')).not.toBeInTheDocument();

    const [privateRadio] = screen.getAllByRole('radio', { name: /비공개방/ });
    await user.click(privateRadio);
    expect(screen.getByLabelText('방 비밀번호')).toBeInTheDocument();

    const [publicRadio] = screen.getAllByRole('radio', { name: /공개방/ });
    await user.click(publicRadio);
    expect(screen.queryByLabelText('방 비밀번호')).not.toBeInTheDocument();
  });

  test('진영을 추가하고 제거할 수 있다', async () => {
    const user = userEvent.setup();
    render(<CreateRoomPage />);

    expect(screen.getAllByText(/진영 #/)).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: '진영 추가' }));
    expect(screen.getAllByText(/진영 #/)).toHaveLength(2);

    const [removeButton] = screen.getAllByRole('button', { name: /제거/ });
    await user.click(removeButton);
    expect(screen.getAllByText(/진영 #/)).toHaveLength(1);
  });
});
