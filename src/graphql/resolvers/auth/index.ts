import { GQL_Resolvers } from 'graphql-resolvers';
import { loginResolver } from './login.mutation';
import { registerResolver } from './register.mutation';
import { logoutResolver } from './logout.mutation';

const resolvers: GQL_Resolvers = {
  Mutation: {
    login: loginResolver,
    logout: logoutResolver,
    register: registerResolver,
  },
};
export default resolvers;
