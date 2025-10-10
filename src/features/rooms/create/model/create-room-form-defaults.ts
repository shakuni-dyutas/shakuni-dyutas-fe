import type { CreateRoomFactionValues, CreateRoomFormValues } from './create-room-form-schema';

const createRoomFactionDefaultValues: CreateRoomFactionValues = {
  title: '',
  description: '',
};

const createRoomFormDefaultValues: CreateRoomFormValues = {
  title: '',
  description: '',
  timeLimitMinutes: '',
  minBetPoint: '',
  visibility: 'public',
  password: '',
  factions: [createRoomFactionDefaultValues],
};

export { createRoomFactionDefaultValues, createRoomFormDefaultValues };
