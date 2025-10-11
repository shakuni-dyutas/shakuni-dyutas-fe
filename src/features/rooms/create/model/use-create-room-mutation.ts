'use client';

import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { CreateRoomRequest } from '@/features/rooms/create/api/create-room';
import { createRoom } from '@/features/rooms/create/api/create-room';
import { resolveCreateRoomErrorMessage } from '@/features/rooms/create/lib/resolve-create-room-error-message';
import { ROUTE_PATHS } from '@/shared/config/constants';
import { logDebug } from '@/shared/lib/logger';

import type { CreateRoomFormValues } from './create-room-form-schema';

const CREATE_ROOM_SUCCESS_MESSAGE = '방 생성이 완료되었어요.';
const CREATE_ROOM_ERROR_MESSAGE = '방 생성에 실패했어요. 잠시 후 다시 시도해 주세요.';

function mapFormValuesToRequest(values: CreateRoomFormValues): CreateRoomRequest {
  const password = values.visibility === 'private' ? values.password : undefined;

  return {
    title: values.title,
    description: values.description,
    timeLimitMinutes: Number(values.timeLimitMinutes),
    minBetPoint: Number(values.minBetPoint),
    visibility: values.visibility,
    password,
    factions: values.factions.map((faction) => ({
      title: faction.title,
      description: faction.description,
    })),
  };
}

function useCreateRoomMutation() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: CreateRoomFormValues) => {
      const request = mapFormValuesToRequest(values);
      return createRoom(request);
    },
    onSuccess: (response) => {
      toast.success(CREATE_ROOM_SUCCESS_MESSAGE);

      const nextPath = response.redirectPath ?? ROUTE_PATHS.HOME;
      router.replace(nextPath);
    },
    onError: async (error) => {
      if (error instanceof HTTPError) {
        const resolvedMessage = await resolveCreateRoomErrorMessage(error);
        toast.error(resolvedMessage ?? CREATE_ROOM_ERROR_MESSAGE);
        return;
      }

      logDebug('CreateRoom', '예기치 못한 오류로 방 생성에 실패했어요.', error);
      toast.error(CREATE_ROOM_ERROR_MESSAGE);
    },
  });

  return {
    createRoom: mutation.mutateAsync,
    isCreatingRoom: mutation.isPending,
    reset: mutation.reset,
  };
}

export { useCreateRoomMutation };
