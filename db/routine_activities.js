const client = require('./client')

async function getRoutineActivityById(id){
    try {
        const { rows: [ routine_activity ] } = await client.query(`
            SELECT *
            FROM routine_activities
            WHERE id=$1;
        `, [ id ]);

        return routine_activity;
    } catch (error) {
        throw error;
    };
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
        const { rows: routine_activity } = await client.query(`
          INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
          VALUES($1, $2, $3, $4) 
          RETURNING *;
        `, [routineId, activityId, count, duration]);
    
        return routine_activity;
      } catch (error) {
        throw error;
      }
}

async function getRoutineActivitiesByRoutine({id}) {
    try{
        
        const { rows: getRoutineActivitiesByRoutineId } = await client.query(`
            SELECT "activityId"
            FROM routine_activities
            WHERE "routineId"=${id};
        `);
 
        const activityPromiseArr = getRoutineActivitiesByRoutineId.map(async (idObj) => await getActivitiesById(idObj.routineId));

        const getRoutineActivitiesByRoutine = Promise.all(activityPromiseArr);
        
        return getRoutineActivitiesByRoutine;

    }
    catch(err) {
        console.error('Error getting activities from routine. Error: ', err);
        throw err;
    }
}

async function updateRoutineActivity ({id, ...fields}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if (setString.length === 0) {
        return;
    };

    try {
        const { rows } = await client.query(`
            UPDATE routine_activities
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));
        return rows;
    } catch (error) {
        throw error;
    };
}

async function destroyRoutineActivity(id) {
    try{

        const { rows: routine_activities } = await client.query(`
            DELETE FROM routine_activities
            WHERE id=${id}
            RETURNING *;
        `);

        return routine_activities;
    }
    catch(err) {
        console.error('Error deleting activity from routine. Error: ', err);
        throw err;
    }
}

async function canEditRoutineActivity(routineActivityId, userId) {
    const setString = Object.keys(userId).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if (setString.length === 0) {
        return;
    };

    try {
        const { rows } = await client.query(`
            ALTER routine_activities
            ADD routine_activities VARCHAR(100)
            UPDATE routine_activities
            SET ${ setString }
            WHERE id=${ routineActivityId }
            RETURNING *;
        `, Object.values(userId));
        return rows;
    } catch (error) {
        throw error;
    };
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
