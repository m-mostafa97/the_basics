'use strict'

const Schema = use('Schema')

class ReplysTableSchema extends Schema {

  up () {
    this.create('replys', (table) => {
      table.increments()
	  table.string('content')
	  table.integer('user_id').unsigned().references('id').inTable('users')
	  //table.integer('post_id').unsigned().references('id').inTable('posts')
	  table.integer('comment_id').unsigned().references('id').inTable('comments')
      table.timestamps()
    })
  }

  down () {
    this.drop('replys')
  }

}

module.exports = ReplysTableSchema
