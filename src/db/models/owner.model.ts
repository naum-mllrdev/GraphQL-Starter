import { BaseModel } from './common/base-model';
import { RelationMappings, Model } from 'objection';

export class Owner extends BaseModel {
  static tableName = 'owners';

  static relationMappings: RelationMappings = {
    pets: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/pet.model`,
      join: {
        from: 'owners.id',
        to: 'pets.ownerId',
      },
    },
  };

  id!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
