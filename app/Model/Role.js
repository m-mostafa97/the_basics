'use strict'

const Lucid = use('Lucid')

class Role extends Lucid {
	users () {
		return this.belongsToMany('App/Model/User')
	}
	permissions () {
		return this.belongsToMany('App/Model/Permission')
	}
}

module.exports = Role
