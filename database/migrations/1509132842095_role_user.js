'use strict'

const Schema = use('Schema')

class RoleUserTableSchema extends Schema {

  up () {
    this.create('role_user', (table) => {
      table.increments()
	  table.integer('user_id').unsigned().references('id').inTable('users')
	  table.integer('role_id').unsigned().references('id').inTable('roles')
    })
  }

  down () {
    this.drop('role_user')
  }

}

module.exports = RoleUserTableSchema
