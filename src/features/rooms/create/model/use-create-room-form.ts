'use client';

import { useEffect } from 'react';
import { type FieldArrayWithId, type UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import {
  createRoomFactionDefaultValues,
  createRoomFormDefaultValues,
} from './create-room-form-defaults';
import {
  CREATE_ROOM_MAX_FACTION_COUNT,
  CREATE_ROOM_MIN_FACTION_COUNT,
  type CreateRoomFormValues,
  type CreateRoomVisibility,
} from './create-room-form-schema';

interface UseCreateRoomFormReturn {
  form: UseFormReturn<CreateRoomFormValues>;
  factionFields: FieldArrayWithId<CreateRoomFormValues, 'factions', 'id'>[];
  appendFaction: () => void;
  removeFaction: (index: number) => void;
  isPrivateRoom: boolean;
  canAppendFaction: boolean;
  setVisibility: (visibility: CreateRoomVisibility) => void;
  resetForm: () => void;
}

function useCreateRoomForm(): UseCreateRoomFormReturn {
  const form = useForm<CreateRoomFormValues>({
    defaultValues: createRoomFormDefaultValues,
    mode: 'onChange',
  });

  const factionArray = useFieldArray({
    control: form.control,
    name: 'factions',
  });

  const visibility = form.watch('visibility');

  useEffect(() => {
    if (visibility === 'public' && form.getValues('password')) {
      form.setValue('password', '', { shouldDirty: true });
    }
  }, [form, visibility]);

  const appendFaction = () => {
    if (factionArray.fields.length >= CREATE_ROOM_MAX_FACTION_COUNT) {
      return;
    }

    factionArray.append({ ...createRoomFactionDefaultValues }, { shouldFocus: false });
  };

  const removeFaction = (index: number) => {
    if (factionArray.fields.length <= CREATE_ROOM_MIN_FACTION_COUNT) {
      return;
    }

    factionArray.remove(index);
  };

  const setVisibility = (nextVisibility: CreateRoomVisibility) => {
    form.setValue('visibility', nextVisibility, { shouldDirty: true });
  };

  const resetForm = () => {
    form.reset({
      ...createRoomFormDefaultValues,
      factions: createRoomFormDefaultValues.factions.map((faction) => ({ ...faction })),
    });
  };

  return {
    form,
    factionFields: factionArray.fields,
    appendFaction,
    removeFaction,
    isPrivateRoom: visibility === 'private',
    canAppendFaction: factionArray.fields.length < CREATE_ROOM_MAX_FACTION_COUNT,
    setVisibility,
    resetForm,
  };
}

export { useCreateRoomForm };
