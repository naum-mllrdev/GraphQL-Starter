import { GQL_MutationResolvers } from 'graphql-resolvers';
import { ValidationError } from 'apollo-server-core';

export const deleteOwnerResolver: GQL_MutationResolvers['deleteOwner'] = async (_, { id }, { services }) => {
  const { ownerService } = services;

  try {
    return await ownerService.deleteById(id);
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
