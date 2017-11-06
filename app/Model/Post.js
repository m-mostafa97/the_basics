'use strict'

const Lucid = use('Lucid')

class Post extends Lucid {
  user () {
    return this.belongsTo('App/Model/User')
  }
  static get dateFormat () {
    return 'YYYY-MM-DD'
  }
  static get createTimestamp () {
    return 'created_at'
  }
  static get updateTimestamp () {
    return 'updated_at'
  }
  static get deleteTimestamp () {
    return 'deleted_at'
  }
}

module.exports = Post
