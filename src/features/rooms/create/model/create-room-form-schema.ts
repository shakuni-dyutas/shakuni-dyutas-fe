import { z } from 'zod';

const CREATE_ROOM_MIN_FACTION_COUNT = 1;
const CREATE_ROOM_MAX_FACTION_COUNT = 6;
const CREATE_ROOM_PASSWORD_MIN_LENGTH = 4;
const CREATE_ROOM_TITLE_MAX_LENGTH = 50;
const CREATE_ROOM_DESCRIPTION_MAX_LENGTH = 500;
const CREATE_ROOM_FACTION_TITLE_MAX_LENGTH = 40;
const CREATE_ROOM_FACTION_DESCRIPTION_MAX_LENGTH = 300;

const numericField = ({
  emptyMessage,
  numericMessage,
  minMessage,
}: {
  emptyMessage: string;
  numericMessage: string;
  minMessage: string;
}) =>
  z
    .string()
    .trim()
    .min(1, emptyMessage)
    .regex(/^\d+$/, numericMessage)
    .refine((value) => Number(value) > 0, minMessage);

const createRoomFactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '진영 이름을 입력해 주세요.')
    .max(
      CREATE_ROOM_FACTION_TITLE_MAX_LENGTH,
      `진영 이름은 최대 ${CREATE_ROOM_FACTION_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    ),
  description: z
    .string()
    .trim()
    .min(1, '진영 설명을 입력해 주세요.')
    .max(
      CREATE_ROOM_FACTION_DESCRIPTION_MAX_LENGTH,
      `진영 설명은 최대 ${CREATE_ROOM_FACTION_DESCRIPTION_MAX_LENGTH}자까지 입력할 수 있습니다.`,
    ),
});

const createRoomFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, '방 제목을 입력해 주세요.')
      .max(
        CREATE_ROOM_TITLE_MAX_LENGTH,
        `방 제목은 최대 ${CREATE_ROOM_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`,
      ),
    description: z
      .string()
      .trim()
      .max(
        CREATE_ROOM_DESCRIPTION_MAX_LENGTH,
        `방 설명은 최대 ${CREATE_ROOM_DESCRIPTION_MAX_LENGTH}자까지 입력할 수 있습니다.`,
      ),
    timeLimitMinutes: numericField({
      emptyMessage: '제한 시간을 입력해 주세요.',
      numericMessage: '제한 시간은 숫자만 입력해 주세요.',
      minMessage: '제한 시간은 1분 이상이어야 합니다.',
    }),
    minBetPoint: numericField({
      emptyMessage: '최소 배팅 포인트를 입력해 주세요.',
      numericMessage: '최소 배팅 포인트는 숫자만 입력해 주세요.',
      minMessage: '최소 배팅 포인트는 1 이상이어야 합니다.',
    }),
    visibility: z.enum(['public', 'private'], '공개 여부를 선택해 주세요.'),
    password: z.string().trim().max(100, '비밀번호는 100자 이하로 입력해 주세요.'),
    factions: z
      .array(createRoomFactionSchema)
      .min(
        CREATE_ROOM_MIN_FACTION_COUNT,
        `진영은 최소 ${CREATE_ROOM_MIN_FACTION_COUNT}개 이상이어야 합니다.`,
      )
      .max(
        CREATE_ROOM_MAX_FACTION_COUNT,
        `진영은 최대 ${CREATE_ROOM_MAX_FACTION_COUNT}개까지 추가할 수 있습니다.`,
      ),
  })
  .superRefine((values, ctx) => {
    if (values.visibility === 'private') {
      if (!values.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '비공개 방의 비밀번호를 입력해 주세요.',
          path: ['password'],
        });
      } else if (values.password.length < CREATE_ROOM_PASSWORD_MIN_LENGTH) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `비밀번호는 최소 ${CREATE_ROOM_PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
          path: ['password'],
        });
      }
    }

    if (values.visibility === 'public' && values.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '공개 방에서는 비밀번호를 사용할 수 없습니다.',
        path: ['password'],
      });
    }
  });

type CreateRoomFactionValues = z.infer<typeof createRoomFactionSchema>;
type CreateRoomFormValues = z.infer<typeof createRoomFormSchema>;
type CreateRoomVisibility = CreateRoomFormValues['visibility'];

export {
  CREATE_ROOM_MAX_FACTION_COUNT,
  CREATE_ROOM_MIN_FACTION_COUNT,
  CREATE_ROOM_PASSWORD_MIN_LENGTH,
  createRoomFactionSchema,
  createRoomFormSchema,
};
export type { CreateRoomFactionValues, CreateRoomFormValues, CreateRoomVisibility };
