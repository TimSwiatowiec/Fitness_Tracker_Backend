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
    const { rows: [ activity ] = await client.query(`
    SELECT id, name, description 
    FROM activities
    WHERE id${ id }
    `)
    
  }
  } catch (error) {
    throw error; 
  }
}

async function getActivityByName(name) {
try {
      const { rows: [ activity ] } = await client.query(`
      SELECT * 
      FROM activities 
      WHERE name=$1
      `, [name]);

      if(!name) {
          throw{
              name: "NameNotFoundError", 
              message: "A activity with that name does not exist"
          }
      }
      return activity;  
    } catch (error) {
      throw error; 
    }
}

async function attachActivitiesToRoutines(routines) {
  
}

// select and return an array of all activities
async function createActivity({ name, description }) {
try {
  const { rows: [activities] } = await client.query(`
    INSERT INTO activities(name, description)
    VALUES ($1, $2)`)
  return activities; 
    
} catch (error) {
    throw error; 
}
}

// return the new activity
async function updateActivity({ id, ...fields }) {
    const { activity } = fields; // might be undefined
    delete fields.activities;
  
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
          WHERE id=${ activityId }
          RETURNING *;
        `, Object.values(fields));
      }
  
      // return early if there's no tags to update
      if (activity === undefined) {
        return await getActivityById(id);
      }
  
      // make any new tags that need to be made
      const tagList = await createTags(tags);
      const tagListIdString = tagList.map(
        tag => `${ tag.id }`
      ).join(', ');
  
      // delete any post_tags from the database which aren't in that tagList
      await client.query(`
        DELETE FROM post_tags
        WHERE "tagId"
        NOT IN (${ tagListIdString })
        AND "postId"=$1;
      `, [postId]);
      
      // and create post_tags as necessary
      await addTagsToPost(postId, tagList);
  
      return await getPostById(postId);
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
