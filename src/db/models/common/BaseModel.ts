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

export class BaseModel extends EnhancedModel {
  // Note: For some reason, if we set QueryBuilder, orderby gets ignored?
  // QueryBuilderType!: MyQueryBuilder<this>;
  // static get QueryBuilder() {
  //   return class<M extends Objection.Model, R = M[]> extends EnhancedModel.QueryBuilder<M, R> {
  //     // cursorPage(cursor?: string | null, before = false) {
  //     //   // tslint:disable-next-line: no-any
  //     //   return super.cursorPage(cursor, before) // .runAfter(result => mapToCursorPaginationResult(result as any));
  //     // }
  //   };
  // }
}
