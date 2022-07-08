const client = require('./client')
const { getRoutineId } = require('./routines')

async function getRoutineActivityById(id){
  try{
    const { rows: [routineActivity] } = await client.query(`
    SELECT*
    FROM routine_activities
    WHERE id=$1
    `, [id]);

    return routineActivity;

  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", "count", "duration")
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [routineId, activityId, count, duration])

    return routine_activity;
  } catch (error) {
    throw error;
  }
    
}

async function getRoutineActivitiesByRoutine({id}) {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId"=$1
    `, [id]);

    return rows;

  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity ({id, ...fields}) {
  try {
    const { rows: [routine_activity] } = await client.query(`
      UPDATE routine_activities
      SET count=$1, duration=$2
      WHERE id=$3
      RETURNING *;
      `, [id, ...fields]);

      return routine_activity
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`
      DELETE FROM routine_activities
      WHERE id=$1
      RETURNING *;
      `, [id]);
      return routine_activity;

  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routine_activity] } = await client.query(`
      EDIT FROM routine_activities
      WHERE id=$1
      RETURNING *;
      `, [routineActivityId, userId]);
      return routine_activity

  } catch (error) {
    throw error;
  }
}
module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
