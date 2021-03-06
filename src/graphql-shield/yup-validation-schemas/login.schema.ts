import * as yup from 'yup';
import { User } from '@app/db/models';

export const loginSchema = yup.object({
  input: yup.object({
    usernameOrEmail: yup
      .string()
      .required()
      .test({
        message: 'Username/Email does not exist.',
        test: async (value: string) => {
          const user = await User.query().where('username', value).orWhere('email', value).first();

          return !!user;
        },
      }),

    password: yup.string().min(8).max(32),
  }),
});
