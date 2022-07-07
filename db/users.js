const client = require("./client");



// database functions

// user functions
async function createUser({ username, password }) {
// const SALT_COUNT = 10;


// bcrypt.hash(password, SALT_COUNT, function(err, hashedPassword) {
//   createUser({
//     username,
//     password: hashedPassword // not the plaintext
//   });
// });
  try {
    const { rows: [ user ] } = await client.query(`
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password])
    return user; 
  } catch (error) {
    throw error; 
  }
}

async function getUser({ username, password }) {

// const user = await getUserByUserName(username);
// const hashedPassword = user.password;

// bcrypt.compare(password, hashedPassword, function(err, passwordsMatch) {
//   if (passwordsMatch) {
//     // return the user object (without the password)
//   } else {
//     throw SomeError;
//   }
// });
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
    try{
        
        const { rows: user } = await client.query(`
            SELECT *
            FROM users
            WHERE username='${userName}'
        `);


        return user;
        
    }
    catch(err) {
        console.error('Error getting user. Error: ', err);
        throw err;
    }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
