import { Owner } from '@app/db/models';
import { OrderByDirection } from 'objection';
import { ICursorPaginationResult } from '@app/core/interfaces';
import { OwnerSortField } from '@app/core/enums';
import { Maybe, GQL_OwnerInput } from 'graphql-resolvers';
import { OwnerAlreadyExistError } from '@app/error-handler/errors/OwnerAlreadyExistError';
import { OwnerNotExistError } from '@app/error-handler/errors/OwnerNotExistError';

async function getById(id: string): Promise<Owner> {
  return Owner.query().findById(id).withGraphFetched('pets');
}

async function create(input: GQL_OwnerInput): Promise<Owner> {
  const { name } = input;

  const owner = await Owner.query().findOne('name', name);
  if (owner) {
    throw new OwnerAlreadyExistError();
  }

  const newOwner: Owner = new Owner();
  newOwner.set({ name });

  return Owner.query().insertAndFetch(newOwner).withGraphFetched('pets');
}

async function deleteById(id: string): Promise<boolean> {
  return Owner.query()
    .delete()
    .where('id', id)
    .then((rowCount) => {
      return rowCount ? true : false;
    });
}

async function updateById(id: string, input: GQL_OwnerInput): Promise<Owner> {
  const { name } = input;

  const owner = await Owner.query().findById(id);
  if (!owner) {
    throw new OwnerNotExistError();
  }

  return Owner.query().updateAndFetchById(id, { name }).withGraphFetched('pets');
}

interface IOwnerCursorPaginatedArgs {
  before?: Maybe<string>;
  after?: Maybe<string>;
  first: number;
  sortDirection: OrderByDirection;
  sortField: OwnerSortField;
}
async function getCursorPaginated(args: IOwnerCursorPaginatedArgs): Promise<ICursorPaginationResult<Owner>> {
  const { before, after, first, sortDirection, sortField } = args;

  const query = Owner.query().withGraphFetched('pets').orderBy(sortField, sortDirection).limit(first);

  if (before) {
    return query.previousCursorPage(before);
  }

  return query.nextCursorPage(after);
}

export const ownerService = {
  getById,
  getCursorPaginated,
  create,
  deleteById,
  updateById,
};
