const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities');
const { getUserByUsername } = require('./users');




async function getRoutineById(id){
  try {
    const { rows: [routine] } = await client.query(`
      SELECT *
      FROM routines
      WHERE id=$1
      `, [id]);

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
    const attachedActivities = await attachActivitiesToRoutines(routines);

    return attachedActivities;
    } catch (error) {
        throw error;
}
}

async function getAllRoutinesByUser({username}) {
  try {
        const allRoutines = await getAllRoutines();
        const userRoutines = allRoutines.filter ((routine)=> {
            if(username === routine.creatorName){
                return true
            }
        })

    return userRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
  try {
    const userRoutines = await getAllRoutinesByUser({username});
    const publicRoutines = userRoutines.filter((routine) => {return routine.isPublic === true})
    
    return publicRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
    try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      WHERE routines."isPublic" = true
    `);

    const attachedActivities = await attachActivitiesToRoutines(routines);

        return attachedActivities;
    }  catch (error) {
        throw error;
      }
    }



async function getPublicRoutinesByActivity({id}) {
    try {
        const { rows: routines } = await client.query(`
            SELECT routines.*, users.username AS "creatorName"
            FROM routines
            JOIN users ON routines."creatorId" = users.id
            JOIN routine_activities ON routine_activities."routineId"=routines.id
            WHERE routines."isPublic" = true
            AND routine_activities."activityId" = $1;
        `, [ id ]);
        // const routinesWithActivities = await Promise.all(routines.map(async routine => {
        //     routine.activities = await getActivityByRoutineId(routine.id);
    
        return attachActivitiesToRoutines(routines);
    } catch (error) {
        throw error
    };
}


async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines ("creatorId", "isPublic", "name", "goal")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, [creatorId, isPublic, name, goal]);
      return routine
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({id, ...fields}) {

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  const objVals = Object.values(fields)

  if (setString.length === 0) {
    return;
  }

  objVals.push(id) // adds id onto it 

  try {
    if (setString.length > 0) {
      const { rows: [routine] } = await client.query(`
        UPDATE routines
        SET ${ setString }
        WHERE id=$${ objVals.length }
        RETURNING *;
        `, objVals);

        return routine;

    }

  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try { 
    await client.query (`
      DELETE FROM routine_activities
      WHERE "routineId"=$1;
      `, [id]);

    const {rows: [routine] } = await client.query(`
      DELETE FROM routines
      WHERE id=$1
      RETURNING *;
      `, [id]);
      return routine;
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