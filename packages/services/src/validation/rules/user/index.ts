import { z } from 'zod';

/**
 * 사용자 아이디 규칙입니다.
 * - 3자 이상 20자 이하
 * - 영문 소문자, 숫자, 밑줄(_)만 사용 가능
 */
export const idRule = z
  .string()
  .min(3, { message: '아이디는 3자 이상이어야 합니다.' })
  .max(20, { message: '아이디는 20자 이하여야 합니다.' })
  .regex(/^[a-z0-9_]+$/, {
    message: '아이디는 영문 소문자, 숫자, 밑줄(_)만 사용할 수 있습니다.',
  });

/**
 * 비밀번호 규칙입니다.
 * - 최소 8자 이상
 * - 최소 하나의 대문자, 소문자, 숫자, 특수문자를 포함
 */
export const passwordRule = z
  .string()
  .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  .regex(/[A-Z]/, { message: '대문자를 하나 이상 포함해야 합니다.' })
  .regex(/[a-z]/, { message: '소문자를 하나 이상 포함해야 합니다.' })
  .regex(/[0-9]/, { message: '숫자를 하나 이상 포함해야 합니다.' })
  .regex(/[\W_]/, { message: '특수문자를 하나 이상 포함해야 합니다.' });

export const loginSchema = z.object({
  id: idRule,
  password: passwordRule,
});

export type LoginFormFields = z.infer<typeof loginSchema>;
