import * as yup from 'yup';
import { Pet } from '@app/db/models';

export const deletePetSchema = yup.object({
  id: yup.string().test({
    message: 'Pet does not exist.',
    test: async (value: string) => {
      const pet = await Pet.query().findById(value);
      return pet ? true : false;
    },
  }),
});
