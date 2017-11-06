'use strict'

const Schema = use('Schema')

class PermissionRoleTableSchema extends Schema {

  up () {
    this.create('permission_role', (table) => {
      table.increments()
	  table.integer('role_id').unsigned().references('id').inTable('roles')
	  table.integer('permission_id').unsigned().references('id').inTable('permissions')
    })
  }

  down () {
    this.drop('permission_role')
  }

}

module.exports = PermissionRoleTableSchema
