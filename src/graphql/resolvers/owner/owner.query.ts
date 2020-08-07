import { GQL_QueryResolvers } from 'graphql-resolvers';
import { OwnerNotExistError } from '@app/error-handler/errors/OwnerNotExistError';

export const ownerResolver: GQL_QueryResolvers['owner'] = async (parent, { id }, { services }) => {
  const { ownerService } = services;

  const owner = await ownerService.getById(id);
  if (!owner) {
    throw new OwnerNotExistError();
  }

  return owner;
};
