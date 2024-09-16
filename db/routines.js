const client = require('./client');

async function getRoutineById(id){
try {
        const { rows: [ routine ] = await client.query(`
        SELECT id, "creatorId"
        FROM routines
        WHERE id${ id }
        `)
      }
      } catch (error) {
        throw error; 
      }
}

async function getRoutinesWithoutActivities(){
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines 
    `); 
    return { rows }
    } catch (error) {
    throw error; 
    }
}
// this function will be routines with activities 
async function getAllRoutines() {
  try {
    
  } catch (error) {
    
  }

}

async function getAllRoutinesByUser({username}) {
  try {
    const { rows: [ user ] } = await client.query(`
    SELECT * 
    FROM users
    WHERE username=$1`,
    [username]);
    
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

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
  try {
    const { rows: [routines] } = await client.query(`
    SELECT *
    FROM routines 
    WHERE routines."isPublic" = 'true'; 
    `)
    return routines; 

  } catch (error) {
    throw error; 
  }
}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
try {
    const { rows: [ routine ] } = await client.query(`
    INSERT INTO users("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    ON CONFLICT ("creatorId") DO NOTHING
    RETURNING *;
    `, [creatorId, isPublic, name, goal])
    
    return routine; 
    } catch (error) {
    throw error; 
    }
}

async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}