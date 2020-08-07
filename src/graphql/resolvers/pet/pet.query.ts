import { GQL_QueryResolvers, GQL_Pet } from 'graphql-resolvers';
import { PetNotExistError } from '@app/error-handler/errors/PetNotExistError';

export const petResolver: GQL_QueryResolvers['pet'] = async (parent, args, { services }) => {
  const { petService } = services;

  const pet = await petService.getById(args.id);
  if (!pet) {
    throw new PetNotExistError();
  }

  return pet;
};
