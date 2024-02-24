const db = require('../../data/dbConfig')

function findBy(filter) {
  //console.log("Searching for user with filter:", filter);
    return db('users').where(filter);
  }

async function findById(id) {
    // return db('users').where({ id }).first();
    const user = await db('products').where('id', '=', id).first()
    return user
  }

async function add(user) {
    // const [userId] = await db('users').insert(user).returning('*');
    // return userId;
    const [userId] = await db('users').insert(user);
    const newUser = await db('users').where('id', userId).first()
    return newUser
  }

  module.exports = {
    findBy,
    findById,
    add,
  };
