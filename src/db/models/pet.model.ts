import { BaseModel } from './common/base-model';
import { RelationMappings, Model } from 'objection';

export class Pet extends BaseModel {
  static tableName = 'pets';

  static relationMappings: RelationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/owner.model`,
      join: {
        from: 'pets.ownerId',
        to: 'owners.id',
      },
    },
  };

  id!: string;
  name!: string;
  ownerId: string | undefined;
  createdAt!: Date;
  updatedAt!: Date;
}
