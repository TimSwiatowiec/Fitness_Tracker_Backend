const client = require("./client")

// database functions
async function getAllActivities() {
 try {
   const { rows } = await client.query(`
   SELECT *
   FROM activities
   `); 
   return { rows }
 } catch (error) {
   throw error; 
 }
}

async function getActivityById(id) {
  try {
    const { rows: [ activity ] } = await client.query(`
    SELECT id, username, description 
    FROM activities
    WHERE id${ id }
    `)
  
  } catch (error) {
    
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
        const createActivityPromises = tagList.map(
          tag => createActivity(routines)
        );
    
        await Promise.all(createActivityPromises);
    
        return await getActivityById(routines);
      } catch (error) {
        throw error;
      }
    }
    


// select and return an array of all activities
async function createActivity({ name, description }) {
    try {
        await client.query(`
          INSERT INTO activities("name", "description")
          VALUES ($1, $2)
          ON CONFLICT ("name", "description") DO NOTHING;
        `, [ name, description ]);
      } catch (error) {
        throw error;
      }
    }


// return the new activity
async function updateActivity({ id, ...fields }) {
     // read off the tags & remove that field 
  const { activity } = fields; // might be undefined
  delete fields.tags;

  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
    }

    // return early if there's no tags to update
    if (activity === undefined) {
      return await getActivityById(id);
    }

    // make any new tags that need to be made
    const activityList = await createActivity(activity);
    const tagListIdString = tagList.map(
      activity => `${ id }`
    ).join(', ');

    // delete any post_tags from the database which aren't in that tagList
    await client.query(`
      DELETE FROM activities
      WHERE "id"
      NOT IN (${ tagListIdString })
      AND "id"=$1;
    `, [id]);
    

    return await getActivityById(id);
  } catch (error) {
    throw error;
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
  updateActivity,
}