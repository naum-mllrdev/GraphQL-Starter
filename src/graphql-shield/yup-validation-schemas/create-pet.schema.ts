import * as yup from 'yup';
import { Pet, Owner } from '@app/db/models';

export const createPetSchema = yup.object({
  input: yup.object({
    name: yup
      .string()
      .min(4)
      .max(32)
      .required()
      .test({
        message: 'Pet already exist.',
        test: async (value: string) => {
          const pet = await Pet.query().findOne('name', value);
          return pet ? false : true;
        },
      }),
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
