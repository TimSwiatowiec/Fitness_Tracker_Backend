const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [ user ] = await client.query(`
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password])
    }
    return user; 
  } catch (error) {
    throw error; 
  }
}

async function getUser({ username, password }) {
  try {
    const { rows } = await client.query(`
    SELECT username, password 
    FROM users
    `); 
    return rows; 
  } catch (error) {
    throw error; 
  }
}

async function getUserById(userId) {
  try {
  const {rows: [ user ] } = await client.query(`
  SELECT id, username
  FROM users
  WHERE id=${ userId }
  `); 

  if(! user){
    throw {
      name: "UserNotFoundError", 
      message: "A user with that id does not exist"
    }
  }
  return user; 
  } catch (error) {
  throw error; 
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [ user ] } = await client.query(`
    SELECT * 
    FROM users
    WHERE username=$1`,
    [userName]);
    
    if(!user) {
      throw {
        name: "UserNotFoundError", 
        message: "A a user with that username does not exist"
      }
    }
    return user;
  } catch (error) {
    throw error; 
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
