import { GQL_Resolvers } from 'graphql-resolvers';
import { ownersResolver } from './owners.query';
import { ownerResolver } from './owner.query';
import { createOwnerResolver } from './createOwner.mutation';
import { deleteOwnerResolver } from './deleteOwner.mutation';
import { updateOwnerResolver } from './updateOwner.mutation';

const resolvers: GQL_Resolvers = {
  Query: {
    owner: ownerResolver,
    owners: ownersResolver,
  },
  Mutation: {
    createOwner: createOwnerResolver,
    deleteOwner: deleteOwnerResolver,
    updateOwner: updateOwnerResolver,
  },
};
export default resolvers;
