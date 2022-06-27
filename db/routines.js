const client = require('./client');

async function getRoutineById(id){
    try {
        const { rows: [ user ] } = await client.query(`
          SELECT id, "creatorId"
          FROM routines
          WHERE id=${ id }
        `);
    
        if (!user) {
          throw {
            name: "RoutineNotFoundError",
            message: "A routine with that id does not exist"
          }
        }
    
        user.routines = await getPublicRoutinesByUser(id);
    
        return user;
      } catch (error) {
        throw error;
      }
    
}

async function getRoutinesWithoutActivities(){
}

async function getAllRoutines() {
    try {
        const { rows } = await client.query(`
          SELECT *
          FROM routine;
        `);
    
    
        return rows;
      } catch (error) {
        throw error;
      }
    
}


async function getAllRoutinesByUser({username}) {
    try {
        const { rows: [ user ] } = await client.query(`
          SELECT *
          FROM routines
          WHERE username=$1
        `, [ username ]);
    
        if (!user) {
          throw {
            name: "UserNotFoundError",
            message: "A user with that username does not exist"
          }
        }
    
        return user.routines;
      } catch (error) {
        throw error;
      }
    
}

async function getPublicRoutinesByUser({username}) {
    try {
        const { rows: [ user ] } = await client.query(`
          SELECT *
          FROM routines
          WHERE username=$1
        `, [ username ]);
    
        if (!routines.isPublic) {
          throw {
            name: "PublicRoutineNotFoundError",
            message: "A public routine with that username does not exist"
          }
        }
    
        return user.isPublic;
      } catch (error) {
        throw error;
      }
    
}

async function getAllPublicRoutines() {
    try {
        const { rows: [routines] } = await client.query(`
          SELECT *
          FROM routines
          WHERE routines."isPublic" = "true";
        `);
      
        return routines;
      } catch (error) {
        throw error;
      }
}

async function getPublicRoutinesByActivity({id}) {

}

async function createRoutine({creatorId, isPublic, name, goal}) {
    try {
        const {rows: [routine]} = await client.query(`
        INSERT INTO users ("creatorID", "isPublic", name, goal)
        VALUES($1, $2, $3, $4)
        ON CONFLICT ("creatorId") DO NOTHING
        RETURNING *;
        `, [creatorId, isPublic, name, goal])
    
    return routine;
}   catch (error) {
    throw error;
}}

async function updateRoutine({id, ...fields}) {
      // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ user ] } = await client.query(`
      UPDATE routines
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
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