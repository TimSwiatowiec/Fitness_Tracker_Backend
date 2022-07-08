const client = require("./client");


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
        
    const {rows: [activity]} = await client.query(`
        SELECT *
        FROM activities
        WHERE id=${id};
    `);
    
    return activity;
    
}
catch (error) {
  throw error;
}
}

async function getActivityByName(name) {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM activities
        WHERE name=$1
    `, [ name ]);
    
        return rows;
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
        SELECT routine_activities.id AS routineActivityId, routine_activities.count, routine_activities.duration, routine_activities."activityId", routine_activities."routineId", activities.* 
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
        const {rows: [activity]} = await client.query(`
          INSERT INTO activities(name, description)
          VALUES ($1, $2)
          ON CONFLICT (name) DO NOTHING
          RETURNING *;
        `, [ name, description ]);
        return activity;
      } catch (error) {
        throw error;
      }
    }


// return the new activity
async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${ index + 1 }`
).join(', ');

if (setString.length === 0) {
    return;
};

try {
    const { rows } = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
    `, Object.values(fields));

    return rows[0];
} catch (error) {
    throw error;
}};


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