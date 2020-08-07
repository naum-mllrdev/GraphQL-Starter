import { GQL_MutationResolvers } from 'graphql-resolvers';
import { ValidationError } from 'apollo-server-core';

export const updateOwnerResolver: GQL_MutationResolvers['updateOwner'] = async (_, { id, input }, { services }) => {
  const { ownerService } = services;

  try {
    return await ownerService.updateById(id, input);
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
