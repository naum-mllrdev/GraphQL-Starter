import { IObjectionCursorResult } from 'objection-cursor';
import { ICursorPaginationResult, ICursorResult } from '@app/core/interfaces';
import Objection from 'objection';

function mapToCursorPaginationResult<M>({ nodes, pageInfo }: IObjectionCursorResult<M>): ICursorPaginationResult<M> {
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

Objection.QueryBuilder.prototype.previousCursorPage = async function(cursor) {
  // tslint:disable-next-line: no-console
  console.log('previousCursorPage');
  const result = await this.clone().cursorPage(cursor, false);
  return mapToCursorPaginationResult(result);
};

Objection.QueryBuilder.prototype.nextCursorPage = async function(cursor) {
  // tslint:disable-next-line: no-console
  console.log('nextCursorPage');
  const result = await this.clone().cursorPage(cursor, true);
  return mapToCursorPaginationResult(result);
};
