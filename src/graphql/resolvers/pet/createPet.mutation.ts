import { GQL_MutationResolvers } from 'graphql-resolvers';
import { ValidationError } from 'apollo-server-core';

export const createPetResolver: GQL_MutationResolvers['createPet'] = async (_, { input }, { services }) => {
  const { petService } = services;

  try {
    return await petService.create(input);
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
