const express = require('express');
const routineActivitiesRouter = express.Router();

// PATCH /api/routine_activities/:routineActivityId

// DELETE /api/routine_activities/:routineActivityId

const { 
    // createPost,
    // getAllPosts,
    updateRoutineActivity,
    getRoutineActivityById,
  } = require('../db');

//   routineActivitiesRouter.get('/', async (req, res, next) => {
//     try {
//       const allPosts = await getAllPosts();
  
//       const posts = allPosts.filter(post => {
//         // the post is active, doesn't matter who it belongs to
//         if (post.active) {
//           return true;
//         }
      
//         // the post is not active, but it belogs to the current user
//         if (req.user && post.author.id === req.user.id) {
//           return true;
//         }
      
//         // none of the above are true
//         return false;
//       });
    
//       res.send({
//         posts
//       });
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   });
  
//   routineActivitiesRouter.post('/', requireUser, async (req, res, next) => {
//     const { title, content, tags = "" } = req.body;
  
//     const tagArr = tags.trim().split(/\s+/)
//     const postData = {};
  
//     if (tagArr.length) {
//       postData.tags = tagArr;
//     }
  
//     try {
//       postData.authorId = req.user.id;
//       postData.title = title;
//       postData.content = content;
  
//       const post = await createPost(postData);
  
//       if (post) {
//         res.send(post);
//       } else {
//         next({
//           name: 'PostCreationError',
//           message: 'There was an error creating your post. Please try again.'
//         })
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   });

routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalRoutineActivity = await getRoutineActivityById(routineActivityId);
  
      if (originalRoutineActivity.author.id === req.user.id) {
        const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
        res.send({ routineActivity: updatedRoutineActivity })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  
  routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
      const routineActivity = await getRoutineActivityById(req.params.routineActivityId);
  
      if (routineActivity && routineActivity.author.id === req.user.id) {
        const updatedRoutineActivity = await updateRoutineActivity(routineActivity.id, { active: false });
  
        res.send({ routineActivity: updatedRoutineActivity });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(routineActivity ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });
  
  
  module.exports = routineActivitiesRouter;
