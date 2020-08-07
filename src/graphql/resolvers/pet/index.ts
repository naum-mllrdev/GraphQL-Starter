import { GQL_Resolvers } from 'graphql-resolvers';
import { petResolver } from './pet.query';
import { petsResolver } from './pets.query';
import { createPetResolver } from './createPet.mutation';
import { deletePetResolver } from './deletePet.mutation';
import { updatePetResolver } from './updatePet.mutation';

const resolvers: GQL_Resolvers = {
  Query: {
    pet: petResolver,
    pets: petsResolver,
  },
  Mutation: {
    createPet: createPetResolver,
    deletePet: deletePetResolver,
    updatePet: updatePetResolver,
  },
};
export default resolvers;
