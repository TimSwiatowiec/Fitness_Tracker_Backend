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
    if (user) delete user.password
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
   const user = await getUserByUsername(username)
    const _password = user[0].password
    console.log(user[0].password, user[0])
    if (_password===password){
        try {
            const {rows: [user]} = await client.query (
                `SELECT id, username
                 FROM users
                 WHERE username=$1`, [username]
            ) 
    return user} 
    catch (error) {
    throw error; 
  }
}}

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
