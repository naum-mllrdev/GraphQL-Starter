// tslint:disable: max-classes-per-file

import Objection, { compose } from 'objection';
import knex from '../../knex';
import { mapToCursorPaginationResult } from './objection-cursor.plugin-helper';

const cursorMixin = require('objection-cursor');

// Attach knex to objection model
Objection.Model.knex(knex);

// Insert plugins if there's any, e.g. objection-timestamps
// but timestamps should be generated
// in the DB level instead of app level.
const EnhancedModel = compose([
  cursorMixin({
    nodes: true,
    results: false,
    pageInfo: {
      total: true,
      remaining: true,
      hasNext: true,
      hasPrevious: true,
    },
  }),
])(Objection.Model);

class MyQueryBuilder<M extends Objection.Model, R = M[]> extends EnhancedModel.QueryBuilder<M, R> {
  // These are necessary. You can just copy-paste them and change the
  // name of the query builder class.
  ArrayQueryBuilderType!: MyQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: MyQueryBuilder<M, M>;
  NumberQueryBuilderType!: MyQueryBuilder<M, number>;
  PageQueryBuilderType!: MyQueryBuilder<M, Objection.Page<M>>;

  cursorPage(cursor?: string | null, before = false) {
    // tslint:disable-next-line: no-any
    return super.cursorPage(cursor, before).runAfter(result => mapToCursorPaginationResult(result as any));
  }
}

export class BaseModel extends EnhancedModel {
  QueryBuilderType!: MyQueryBuilder<this>;
  static get QueryBuilder() {
    return MyQueryBuilder;
  }
}
