'use strict'

const Lucid = use('Lucid')

class Permission extends Lucid {
	roles () {
		return this.belongsToMany('App/Model/Role')
	}
}

module.exports = Permission
