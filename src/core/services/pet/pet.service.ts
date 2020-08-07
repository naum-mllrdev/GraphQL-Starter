import { Pet, Owner } from '@app/db/models';
import { OrderByDirection } from 'objection';
import { ICursorPaginationResult } from '@app/core/interfaces';
import { PetSortField } from '@app/core/enums';
import { Maybe, GQL_PetInput } from 'graphql-resolvers';
import { PetAlreadyExistError } from '@app/error-handler/errors/PetAlreadyExistError';
import { OwnerNotExistError } from '@app/error-handler/errors/OwnerNotExistError';
import { PetNotExistError } from '@app/error-handler/errors/PetNotExistError';

async function getById(id: string): Promise<Pet> {
  return Pet.query().findById(id).withGraphFetched('owner');
}

async function create(input: GQL_PetInput): Promise<Pet> {
  const { name, ownerId } = input;

  const pet = await Pet.query().where('name', name).first();
  if (pet) {
    throw new PetAlreadyExistError();
  }

  const newPet: Pet = new Pet();
  newPet.set({ name });

  if (ownerId) {
    const matchedOwner = await Owner.query().findById(ownerId);
    if (!matchedOwner) {
      throw new OwnerNotExistError();
    }
    newPet.set({ ownerId });
  }

  return Pet.query().insertAndFetch(newPet).withGraphFetched('owner');
}

async function deleteById(id: string): Promise<boolean> {
  return Pet.query()
    .delete()
    .where('id', id)
    .then((rowCount) => {
      return rowCount ? true : false;
    });
}

async function updateById(id: string, input: GQL_PetInput): Promise<Pet> {
  const { name, ownerId } = input;

  const pet = await Pet.query().findById(id);
  if (!pet) {
    throw new PetNotExistError();
  }

  if (ownerId) {
    const owner = await Owner.query().findById(ownerId);
    if (!owner) {
      throw new OwnerNotExistError();
    }
    return Pet.query().updateAndFetchById(id, { name, ownerId }).withGraphFetched('owner');
  }

  return Pet.query().updateAndFetchById(id, { name }).withGraphFetched('owner');
}

interface IPetCursorPaginatedArgs {
  before?: Maybe<string>;
  after?: Maybe<string>;
  first: number;
  sortDirection: OrderByDirection;
  sortField: PetSortField;
}
async function getCursorPaginated(args: IPetCursorPaginatedArgs): Promise<ICursorPaginationResult<Pet>> {
  const { before, after, first, sortDirection, sortField } = args;

  const query = Pet.query().withGraphFetched('owner').orderBy(sortField, sortDirection).limit(first);

  if (before) {
    return query.previousCursorPage(before);
  }

  return query.nextCursorPage(after);
}

export const petService = {
  getById,
  getCursorPaginated,
  create,
  deleteById,
  updateById,
};
