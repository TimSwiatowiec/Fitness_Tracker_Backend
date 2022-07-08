const client = require('./client');
const { getActivitiesByRoutineId } = require('./activities');
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
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      `,);

    const routinesWithActivities = await Promise.all(routines.map(async routine => {
      routine.activities = await getActivitiesByRoutineId(routine.id);
      return routine;
    }))

    return routinesWithActivities;

  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({username}) {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      WHERE users.username = $1
      `, [username]);

    const routinesWithActivities = await Promise.all(routines.map(async routine => {
      routine.activities = await getActivitiesByRoutineId(routine.id);
      return routine;
    }))

    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
  try {
    const user = await getUserByUsername(username)

    const { rows: routines } = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON users.id = routines."creatorId"
        WHERE "isPublic" = true
        `);

    const routinesWithActivities = await Promise.all(routines.map(async routine => {
      routine.activities = await getActivitiesByRoutineId(routine.id);
      return routine;
    }))
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try{
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      WHERE routines."isPublic" = true
      `);

    const routinesWithActivities = await Promise.all(routines.map(async routine => {
      routine.activities = await getActivitiesByRoutineId(routine.id);
      return routine;
    }))
    
    return routinesWithActivities;

  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({id}) {
  try{
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON users.id = routines."creatorId"
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      WHERE routines."isPublic" = true AND routine_activities."activityId"=$1;
      `, [id]);

    const routinesWithActivities = await Promise.all(routines.map(async routine => {
      routine.activities = await getActivitiesByRoutineId(routine.id);
      return routine;
    }))

    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
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