import { GQL_MutationResolvers } from 'graphql-resolvers';
import { ValidationError } from 'apollo-server-core';

export const deletePetResolver: GQL_MutationResolvers['deletePet'] = async (_, { id }, { services }) => {
  const { petService } = services;

  try {
    return await petService.deleteById(id);
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
