'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { type FieldArrayWithId, type UseFormReturn, useFieldArray, useForm } from 'react-hook-form';
import {
  getCreateRoomFactionDefaultValues,
  getCreateRoomFormDefaultValues,
} from './create-room-form-defaults';
import {
  CREATE_ROOM_MAX_FACTION_COUNT,
  CREATE_ROOM_MIN_FACTION_COUNT,
  type CreateRoomFormValues,
  createRoomFormSchema,
} from './create-room-form-schema';

interface UseCreateRoomFormReturn {
  form: UseFormReturn<CreateRoomFormValues>;
  factionFields: FieldArrayWithId<CreateRoomFormValues, 'factions', 'id'>[];
  appendFaction: () => void;
  removeFaction: (index: number) => void;
  canAppendFaction: boolean;
  resetForm: () => void;
}

function useCreateRoomForm(): UseCreateRoomFormReturn {
  const defaultValues = useMemo(() => getCreateRoomFormDefaultValues(), []);

  const form = useForm<CreateRoomFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(createRoomFormSchema),
  });

  const factionArray = useFieldArray({
    control: form.control,
    name: 'factions',
  });

  const factions = form.watch('factions');

  const appendFaction = () => {
    const currentCount = form.getValues('factions').length;
    if (currentCount >= CREATE_ROOM_MAX_FACTION_COUNT) {
      return;
    }

    factionArray.append(getCreateRoomFactionDefaultValues(), { shouldFocus: false });
    form.trigger('factions');
  };

  const removeFaction = (index: number) => {
    const currentCount = form.getValues('factions').length;
    if (currentCount <= CREATE_ROOM_MIN_FACTION_COUNT) {
      return;
    }

    factionArray.remove(index);
    form.trigger('factions');
  };

  const resetForm = () => {
    const resetValues = getCreateRoomFormDefaultValues();
    form.reset(resetValues, { keepDefaultValues: false });
  };

  return {
    form,
    factionFields: factionArray.fields,
    appendFaction,
    removeFaction,
    canAppendFaction: factions.length < CREATE_ROOM_MAX_FACTION_COUNT,
    resetForm,
  };
}

export { useCreateRoomForm };
