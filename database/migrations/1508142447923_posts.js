'use strict'

const Schema = use('Schema')

class PostsTableSchema extends Schema {

  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('title')
      table.text('content')
      table.string('avatar')
      table.string('category')
      table.string('keywords')
      table.integer('rate').notNullable().defaultTo(1)
      table.timestamps()
      table.softDeletes()
      table.integer('user_id').unsigned().references('id').inTable('users')
    })
  }

  down () {
    this.drop('posts')
  }

}

module.exports = PostsTableSchema
