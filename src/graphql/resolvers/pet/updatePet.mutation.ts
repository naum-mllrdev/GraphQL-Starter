import { GQL_MutationResolvers } from 'graphql-resolvers';
import { ValidationError } from 'apollo-server-core';

export const updatePetResolver: GQL_MutationResolvers['updatePet'] = async (_, { id, input }, { services }) => {
  const { petService } = services;

  try {
    return await petService.updateById(id, input);
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
