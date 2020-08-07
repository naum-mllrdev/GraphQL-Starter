import { GQL_MutationResolvers } from 'graphql-resolvers';
import { ValidationError } from 'apollo-server-core';

export const createOwnerResolver: GQL_MutationResolvers['createOwner'] = async (_, { input }, { services }) => {
  const { ownerService } = services;

  try {
    return await ownerService.create(input);
  } catch (err) {
    throw new ValidationError(err.message);
  }
};
