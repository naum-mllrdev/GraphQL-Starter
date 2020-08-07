import { ApolloError } from 'apollo-server-express';

export class OwnerAlreadyExistError extends ApolloError {
  httpStatusCode = 409;

  constructor() {
    super('Owner already exist', 'OWNER_ALREADY_EXIST');
  }
}
