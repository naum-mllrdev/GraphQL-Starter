import * as Knex from 'knex';

const TABLE_NAME = 'owner_pets';

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);

  if (!tableExists) {
    await knex.schema.createTable(TABLE_NAME, (t) => {
      t.uuid('ownerId').notNullable();
      t.uuid('petId').notNullable();

      t.foreign('ownerId').references('owners.id');
      t.foreign('petId').references('pets.id');

      t.unique(['ownerId', 'petId']);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
