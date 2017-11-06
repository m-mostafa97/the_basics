'use strict'

const Schema = use('Schema')

class PermissionsTableSchema extends Schema {

  up () {
    this.create('permissions', (table) => {
      table.increments()
	  table.string('name')
    })
  }

  down () {
    this.drop('permissions')
  }

}

module.exports = PermissionsTableSchema
