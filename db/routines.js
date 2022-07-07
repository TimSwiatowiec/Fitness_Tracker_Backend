const client = require('./client');
// const { getUserByUsername, getUserById } = require('./users');
// const { getActivitiesByRoutineId } = require('./activities');
const { attachActivitiesToRoutines } =  require('./activities');

async function getRoutineById(id){
    try {
        const { rows: [ routine ] } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=$1;
        `, [ id ]);

        return routine;
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
    try {
        const { rows: routines } = await client.query(`
            SELECT username AS "creatorName", routines.*
            FROM routines
            JOIN users ON users.id=routines."creatorId";
        `);


    //     const routines = await getRoutinesWithoutActivities();
    //     console.log(attachActivitiesToRoutines);
        const attachedActivities = await attachActivitiesToRoutines(routines);
    //     console.log("routines w/ activities:", attachedActivities)
    //     console.log("routines:", routines)
        
        return attachedActivities;
    // } catch (error) {
    //   throw error;
    
} catch (error) {
    throw error;
}
}


async function getAllRoutinesByUser({username}) {
    try {
        const user = await getUserByUsername(username);
        const id = user.id;

        const { rows: routines } = await client.query(`
            SELECT username AS "creatorName", routines.*
            FROM routines
            JOIN users ON users.id=routines."creatorId", 
            routine_activities ON routine_activities."routineId"=routines.id
            WHERE routine_activities."activityId"=$1
        `);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };

        return routines;
    } catch (error) {
        throw error;
    };
}

async function getPublicRoutinesByUser({username}) {
    try {
        const user = await getUserByUsername(username);
        const id = user.id;


        const { rows: routines } = await client.query(`
            SELECT username AS "creatorName", routines.*
            FROM routines
            JOIN users ON users.id=routines."creatorId", 
            routine_activities ON routine_activities."routineId"=routines.id
            WHERE routine_activities."activityId"=$1
        `);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };

        return routines;
    } catch (error) {
        throw error;
    };
    
}

async function getAllPublicRoutines() {
  
    try {
        const { rows: routines } = await client.query(`
            SELECT username AS "creatorName", routines.*
            FROM routines
            JOIN users ON users.id=routines."creatorId", 
            routine_activities ON routine_activities."routineId"=routines.id
            WHERE routine_activities."activityId"=$1
            AND public=true;
        `);

        const attachedActivities = await attachActivitiesToRoutines(routines);

        return attachedActivities;
    } catch (error) {
        throw error;
      }
}

async function getPublicRoutinesByActivity({id}) {
    try {
        const { rows: routines } = await client.query(`
            SELECT username AS "creatorName", routines.*
            FROM routines
            JOIN routine_activities ON routine_activities."routineId"=routines.id
            WHERE routine_activities."activityId"=$1
            AND public=true;
        `, [ id ]);

        for (let routine of routines) {
            routine.activities = await getActivitiesByRoutineId(routine.id);
        };

        return routines;
    } catch (error) {
        throw error
    };
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
        await client.query(`
            DELETE FROM routines
            WHERE id=$1;
        `, [ id ]);

   
    } catch(error) {
        throw error;
    };
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