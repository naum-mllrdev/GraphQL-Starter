import * as yup from 'yup';
import { Owner } from '@app/db/models';

export const createOwnerSchema = yup.object({
  input: yup.object({
    name: yup
      .string()
      .min(4)
      .max(32)
      .required()
      .test({
        message: 'Owner already exist.',
        test: async (value: string) => {
          const owner = await Owner.query().findOne('name', value);
          return owner ? false : true;
        },
      }),
  }),
});
