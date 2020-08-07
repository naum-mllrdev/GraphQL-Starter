import { ApolloError } from 'apollo-server-express';

export class OwnerNotExistError extends ApolloError {
  httpStatusCode = 409;

  constructor() {
    super('Owner not exist', 'OWNER_NOT_EXIST');
  }
}
