import { GQL_QueryResolvers, GQL_PetConnection, GQL_PetEdge } from 'graphql-resolvers';
import { PetSortField, SortDirection } from '@app/core/enums';

export const petsResolver: GQL_QueryResolvers['pets'] = async (parent, args, { services }) => {
  const { petService } = services;

  if (!args.sortBy) {
    args.sortBy = {
      field: PetSortField.CREATED_AT,
      direction: SortDirection.ASC,
    };
  }

  const result = await petService.getCursorPaginated({
    before: args.before,
    after: args.after,
    first: args.first,
    sortDirection: args.sortBy.direction,
    sortField: args.sortBy.field,
  });

  const petConnection: GQL_PetConnection = {
    edges: result.results.map<GQL_PetEdge>((x) => ({
      cursor: x.cursor,
      node: x.data,
    })),
    nodes: result.results.map((x) => x.data),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  };

  return petConnection;
};
