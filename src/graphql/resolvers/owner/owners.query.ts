import { GQL_QueryResolvers, GQL_OwnerConnection, GQL_OwnerEdge } from 'graphql-resolvers';
import { OwnerSortField, SortDirection } from '@app/core/enums';

export const ownersResolver: GQL_QueryResolvers['owners'] = async (parent, args, { services }) => {
  const { ownerService } = services;

  if (!args.sortBy) {
    args.sortBy = {
      field: OwnerSortField.CREATED_AT,
      direction: SortDirection.ASC,
    };
  }

  const result = await ownerService.getCursorPaginated({
    before: args.before,
    after: args.after,
    first: args.first,
    sortDirection: args.sortBy.direction,
    sortField: args.sortBy.field,
  });

  const ownerConnection: GQL_OwnerConnection = {
    edges: result.results.map<GQL_OwnerEdge>((x) => ({
      cursor: x.cursor,
      node: x.data,
    })),
    nodes: result.results.map((x) => x.data),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  };

  return ownerConnection;
};
