import * as yup from 'yup';
import { Pet, Owner } from '@app/db/models';

export const updatePetSchema = yup.object({
  id: yup.string().test({
    message: 'Pet does not exist.',
    test: async (id: string) => {
      const pet = await Pet.query().findById(id);
      return pet ? true : false;
    },
  }),
  input: yup.object({
    name: yup.string().min(4).max(32).required(),
    ownerId: yup
      .string()
      .optional()
      .test({
        message: 'Owner does not exist.',
        test: async (value: string) => {
          const owner = await Owner.query().findById(value);
          return owner ? true : false;
        },
      }),
  }),
});
