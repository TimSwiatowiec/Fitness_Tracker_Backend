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
    try {
        const { rows } = await client.query(`
          SELECT *
          FROM routines;
        `);
    
    
        return rows;
      } catch (error) {
        throw error;
      }
}

async function getAllRoutines() {
    

      try{
        const { rows: routines } = await client.query(`
          SELECT *
          FROM routines;
        `);
    
    //     const routines = await getRoutinesWithoutActivities();
    //     console.log(attachActivitiesToRoutines);
    //     const attachedActivities = await attachActivitiesToRoutines(routines);
    //     console.log("routines w/ activities:", attachedActivities)
    //     console.log("routines:", routines)
        
    //     return attachedActivities;
    // } catch (error) {
    //   throw error;
    return routines;
        
}
catch(err) {
    console.error('Error getting public routines. Error: ', err);
    throw err;
}
}


async function getAllRoutinesByUser({username}) {
    try{

        const [{ id }] = await getUserByUsername(username);

        const { rows: routines } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=${id};
        `)

        return routines;
        
    }
    catch(err) {
        console.error('Error getting all routines by user. Error: ', err);
        throw err;
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
    try {
        const {rows: [routines]} = await client.query(`
        SELECT *
        FROM routines
        WHERE routines."isPublic" = 'true'
        `)
    } catch (error) {
        throw error;
    }

}

async function createRoutine({creatorId, isPublic, name, goal}) {
    try {
        const {rows: [routine]} = await client.query(`
        INSERT INTO routines ("creatorId", "isPublic", name, goal)
        VALUES($1, $2, $3, $4)
        ON CONFLICT ("name") DO NOTHING
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
    const { rows: [ routine ] } = await client.query(`
      UPDATE routines
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const { rows: [routine] } = await client.query(`
    DELETE 
    FROM routines
    WHERE id${routine.id}
    `)
  } catch (error) {
    throw error;
  }
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