'use strict'

const Lucid = use('Lucid')
const Hash = use('Hash')

class User extends Lucid {

  static boot () { 
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword') 
  }

	
	roles () {
		return this.belongsToMany('App/Model/Role')
	}

//  apiTokens () {
//    return this.hasMany('App/Model/Token')
//  }
//  posts () {
//    return this.hasMany('App/Model/Post')
//  }

}

module.exports = User
