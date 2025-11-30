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
  factions: [{ ...createRoomFactionDefaultValues }],
};

const getCreateRoomFactionDefaultValues = (): CreateRoomFactionValues => ({
  ...createRoomFactionDefaultValues,
});

const getCreateRoomFormDefaultValues = (): CreateRoomFormValues => ({
  ...createRoomFormDefaultValues,
  factions: createRoomFormDefaultValues.factions.map((faction) => ({ ...faction })),
});

export {
  createRoomFactionDefaultValues,
  createRoomFormDefaultValues,
  getCreateRoomFactionDefaultValues,
  getCreateRoomFormDefaultValues,
};
