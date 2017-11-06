'use strict'

const Lucid = use('Lucid')

class Comment extends Lucid {
  static get deleteTimestamp () {
    return 'deleted_at'
  }
}

module.exports = Comment
