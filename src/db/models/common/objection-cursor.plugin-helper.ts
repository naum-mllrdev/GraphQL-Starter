import { IObjectionCursorResult } from 'objection-cursor';
import { ICursorPaginationResult, ICursorResult } from '@app/core/interfaces';

export function mapToCursorPaginationResult<M>({ nodes, pageInfo }: IObjectionCursorResult<M>): ICursorPaginationResult<M> {
  const result: ICursorPaginationResult<M> = {
    // For now, they're the same
    results: nodes.map<ICursorResult<M>>(({ cursor, data }) => ({ cursor, data })),

    pageInfo: {
      endCursor: nodes[0]?.cursor,
      startCursor: nodes[nodes.length - 1]?.cursor,
      hasNextPage: pageInfo.hasNext,
      hasPreviousPage: pageInfo.hasPrevious,
    },
    remaining: pageInfo.remaining,
    totalCount: pageInfo.total,
  };
  return result;
}
