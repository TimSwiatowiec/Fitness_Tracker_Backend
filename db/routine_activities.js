const client = require('./client')

async function getRoutineActivityById(id){
    try{
        
        const { rows: activityIdArr } = await client.query(`
            SELECT "activityId"
            FROM routine_activities
            WHERE "routineId"=${id};
        `);
 
        const activityPromiseArr = activityIdArr.map(async (idObj) => await getActivitiesById(idObj.activityId));

        const activityArr = Promise.all(activityPromiseArr);
        
        return activityArr;

    }
    catch(err) {
        console.error('Error getting activities from routine. Error: ', err);
        throw err;
    }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
        const { rows: addedActivityToRoutine } = await client.query(`
          INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
          VALUES($1, $2, $3, $4) 
          RETURNING *;
        `, [routineId, activityId, count, duration]);
    
        return addedActivityToRoutine;
      } catch (error) {
        throw error;
      }
}

async function getRoutineActivitiesByRoutine({id}) {
    try {
        const { routineActivtiesByRoutine } = await client.query(`
          SELECT *
          FROM routine_activity
          WHERE id=$1
        `, [ id ]);
    
        return routineActivtiesByRoutine;
      } catch (error) {
        throw error;
      }
}

async function updateRoutineActivity ({id, ...fields}) {
    // read off the tags & remove that field 
  const { routine_activity } = fields; // might be undefined
  delete fields.tags;

  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(`
        UPDATE routine_activity
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
    }

    // return early if there's no tags to update
    if (routine_activity === undefined) {
      return await getRoutineById(id);
    }

    // make any new tags that need to be made
    const routine_activityList = await createRoutineActivity(id);
    const routine_activityListIdString = routine_activityList.map(
      tag => `${ routine_activity.id }`
    ).join(', ');

    // delete any post_tags from the database which aren't in that tagList
    await client.query(`
      DELETE FROM routine_activity
      WHERE "id"
      NOT IN (${ routine_activityListIdString })
      AND "id"=$1;
    `, [id]);
    
    // and create post_tags as necessary
    await updateRoutineActivity(routine_activty.id, routine_activityList);

    return await routine_activity(id);
  } catch (error) {
    throw error;
  }

}

async function destroyRoutineActivity(id) {
    try {
        const { rows } = await client.query(`
        DELETE 
        FROM routine_activities
        WHERE id=${id}
        `)
        return rows
      } catch (error) {
        throw error;
      }
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
