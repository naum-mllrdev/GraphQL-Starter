import * as yup from 'yup';
import { Owner } from '@app/db/models';

export const deleteOwnerSchema = yup.object({
  id: yup.string().test({
    message: 'Owner does not exist.',
    test: async (value: string) => {
      const owner = await Owner.query().findById(value);
      return owner ? true : false;
    },
  }),
});
