'use strict'

const Schema = use('Schema')

class CommentsTableSchema extends Schema {

  up () {
    this.create('comments', (table) => {
      table.increments()
      table.text('cotent')
      table.timestamps()
      table.softDeletes()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('post_id').unsigned().references('id').inTable('posts')
    })
  }

  down () {
    this.drop('comments')
  }

}

module.exports = CommentsTableSchema
