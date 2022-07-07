const client = require("./client");
const { getRoutinesWithoutActivities } = require("./routines");

// database functions
async function getAllActivities() {
 try {
   const { rows } = await client.query(`
   SELECT *
   FROM activities
   `); 
   return rows
 } catch (error) {
   throw error; 
 }
}

async function getActivityById(id) {
  try{
        
    const { rows: activity } = await client.query(`
        SELECT *
        FROM activities
        WHERE id=${id};
    `);
    
    return activity;
    
}
catch(err) {
    console.error('Error getting activities by id. Error: ', err);
    throw err;
}
}

async function getActivityByName(name) {
    try {
        const { rows: [ user ] } = await client.query(`
          SELECT *
          FROM activities
          WHERE activities=$1
        `, [ name ]);
    
        if (!user) {
          throw {
            name: "ActivityNotFoundError",
            message: "A Activity with that username does not exist"
          }
        }
    
        return user;
      } catch (error) {
        throw error;
      }
}

async function attachActivitiesToRoutines(routines) {
    try {

        // activitieroutine_activities
        //id --> activitt.id    
        //name            
        // activityId
        // alias routineActivityId, routineId, 
        //table.column for name, activityId, etc. AS on the column
        const {rows} = await client.query(`
        SELECT routine_activities.id AS routineActivityId, activity.id AS activityId, routine 
        FROM activities
        JOIN "routine_activities" ON routine_activities."activityId"=activities.id
        `);
    
        
        for(let i = 0; i < routines.length; i++){
            let currentRoutine = routines[i];
            currentRoutine.activities = rows.filter((act)=> act.routineId === currentRoutine.id)
        }
        console.log("all my routines:", routines)
        return routines
      } catch (error) {
        throw error;
      }
    }




// select and return an array of all activities
async function createActivity({ name, description }) {
    try {
        const {rows: [activityToCreate]} = await client.query(`
          INSERT INTO activities("name", "description")
          VALUES ($1, $2)
          ON CONFLICT ("name") DO NOTHING
          RETURNING *;
        `, [ name, description ]);
        return activityToCreate;
      } catch (error) {
        throw error;
      }
    }


// return the new activity
async function updateActivity({ id, ...fields }) {
  try{

    //Format setString into a string format that can be passed into PSQL ('"field1"=$1, "field2"=$1', etc.)
    const setString = Object.keys(fields).map( (key, index) => `"${ key }"=$${ index + 1 }`).join(', ');
    
    //If activity id is missing or no update fields are povided, return early
    if(!id || setString.length === 0){
        throw new Error('Missing field. Please provide userId and a field to update.');
        return;
    }

    const { rows: [activityObj] } = await client.query(`
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
    `, Object.values(fields));

    return activityObj;

}
catch(err) {
    console.error('Error updating activity. Error: ', err);
    throw err;
}
}

// don't try to update the id
// do update the name and description
// return the updated activity
module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity
}