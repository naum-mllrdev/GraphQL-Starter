import { UserInputError } from 'apollo-server-core';
import * as yup from 'yup';
import { rule } from 'graphql-shield';
import * as _ from 'lodash';

// tslint:disable-next-line: no-any
export const yupRule = (schema: yup.Schema<any>) =>
  rule()(async (parent, args) => {
    try {
      const validatedArgs = await schema.validate(args, { abortEarly: false });

      // Merge validatedArgs to args
      _.assign(args, validatedArgs);

      return true;
    } catch (err) {
      /**
       * Note:
       * We need to catch here and simply return the error to be forwarded
       * later on our error handler (see formatError handler in ApolloServer initialization).
       *
       * If we don't catch it and let GraphQL Shield catch the error, it would
       * treat it as an INTERNAL_SERVER_ERROR with a message "Not authorised!"
       * which is not what we want.
       */
      return err;
    }
  });
