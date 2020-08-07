import { ApolloError } from 'apollo-server-express';

export class PetAlreadyExistError extends ApolloError {
  httpStatusCode = 409;

  constructor() {
    super('Pet already exist', 'PET_ALREADY_EXIST');
  }
}
