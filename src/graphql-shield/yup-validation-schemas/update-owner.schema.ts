import * as yup from 'yup';
import { Owner } from '@app/db/models';

export const updateOwnerSchema = yup.object({
  id: yup.string().test({
    message: 'Owner does not exist.',
    test: async (id: string) => {
      const owner = await Owner.query().findById(id);
      return owner ? true : false;
    },
  }),
  input: yup.object({
    name: yup.string().min(4).max(32).required(),
  }),
});
