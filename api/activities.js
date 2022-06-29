const express = require('express');
const activitiesRouter = express.Router();

// GET /api/activities/:activityId/routines
// fetch('http://fitnesstrac-kr.herokuapp.com/api/activities/3/routines', {
//   headers: {
//     'Content-Type': 'application/json',
//   },
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    try {
      const allActvities = await getAllActivities();
  
      const activities = allActvities.filter(activity => {
        // the post is active, doesn't matter who it belongs to
        if (activity.active) {
          return true;
        }
      
        // the post is not active, but it belogs to the current user
        if (req.user && activity.author.id === req.user.id) {
          return true;
        }
      
        // none of the above are true
        return false;
      });
    
      res.send({
        activities
      });
    } catch ({ name, description }) {
      next({ name, description });
    }
  });

// GET /api/activities
// fetch('http://fitnesstrac-kr.herokuapp.com/api/activities', {
//   headers: {
//     'Content-Type': 'application/json',
//   },
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
activitiesRouter.get('/', async (req, res, next) => {
    try {
      const allActivities = await getAllActivities();
  
      const activities = allActivities.filter(activity => {
        // the post is active, doesn't matter who it belongs to
        if (activity.active) {
          return true;
        }
      
        // the post is not active, but it belogs to the current user
        if (req.user && activity.author.id === req.user.id) {
          return true;
        }
      
        // none of the above are true
        return false;
      });
    
      res.send({
        activities
      });
    } catch ({ name, description }) {
      next({ name, description });
    }
  });

// POST /api/activities
// fetch('http://fitnesstrac-kr.herokuapp.com/api/activities', {
//   method: "POST",
//   body: JSON.stringify({
//     name: 'Running',
//     description: 'Keep on running!'
//   })
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content = "" } = req.body;
  
    const activitiesData = {};
  
    if (routinesArr.length) {
      activitiesData.routine = routinesArr;
    }
  
    try {
      activityData.authorId = req.user.id;
      activityData.title = title;
      activityData.content = content;
  
      const activity = await createPost(activityData);
  
      if (activity) {
        res.send(activity);
      } else {
        next({
          name: 'ActivityCreationError',
          message: 'There was an error creating your activity. Please try again.'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


// PATCH /api/activities/:activityId
// fetch('http://fitnesstrac-kr.herokuapp.com/api/activities/9', {
//   method: "PATCH",
//   body: JSON.stringify({
//     name: 'Running',
//     description: 'Keep on running, til you drop!'
//   })
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (routines && routines.length > 0) {
      updateFields.routines = routines.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalActivity = await getActivityById(activityId);
  
      if (originalActivity.author.id === req.user.id) {
        const updatedActivity = await updateActivity(activityId, updateFields);
        res.send({ activity: updatedActivity })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a activity that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  

module.exports = activitiesRouter;