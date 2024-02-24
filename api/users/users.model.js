const db = require('../../data/dbConfig')

function findBy(filter) {
    return db('users').where(filter);
  }

  function findById(id) {
    return db('users').where({ id }).first();
  }

  function add(user) {
    return db('users').insert(user).returning('*');
  }

  module.exports = {
    findBy,
    findById,
    add,
  };
