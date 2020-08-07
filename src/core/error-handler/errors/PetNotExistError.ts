import { ApolloError } from 'apollo-server-express';

export class PetNotExistError extends ApolloError {
  httpStatusCode = 409;

  constructor() {
    super('Pet not exist', 'PET_NOT_EXIST');
  }
}
