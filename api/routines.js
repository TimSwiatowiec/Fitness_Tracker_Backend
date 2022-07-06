const express = require('express');
const { destroyRoutine } = require('../db/routines');
const routinesRouter = express.Router();

// GET /api/routines
// fetch('http://fitnesstrac-kr.herokuapp.com/api/routines', {
//   headers: {
//     'Content-Type': 'application/json',
//   },
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
routinesRouter.get('/', async (req, res, next) => {
    try {
      const allRoutines = await getAllRoutines();
  
      res.send({
        routines
    });
      
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// POST /api/routines
// fetch('http://fitnesstrac-kr.herokuapp.com/api/routines', {
//   method: "POST",
//   body: JSON.stringify({
//     name: 'Long Cardio Routine',
//     goal: 'To get your heart pumping!',
//     isPublic: true
//   })
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
routinesRouter.post('/', requireUser, async (req, res, next) => {
 
  
    try {
  
      const makeRoutines = await createRoutines();
  
     
    } catch (error) {
      throw error;
    }
  });

// PATCH /api/routines/:routineId
// fetch('http://fitnesstrac-kr.herokuapp.com/api/routines/6', {
//   method: "PATCH",
//   body: JSON.stringify({
//     name: 'Long Cardio Day',
//     goal: 'To get your heart pumping!'
//   })
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
routinesRouter.patch('/:routineId', async(res, req, next) => {
    try {
        const updatingRoutine = await destroyRoutine();

    } catch (error) {
        throw error;
    }
})

// DELETE /api/routines/:routineId
// fetch('http://fitnesstrac-kr.herokuapp.com/api/routines/6', {
//   method: "DELETE",
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer TOKEN_STRING_HERE'
//   }
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
      const routine = await getRouterById(req.params.postId);
  
      if (routine && routine.author.id === req.user.id) {
        const upRoutine = await updateRoutine(routine.id, { active: false });
  
        res.send({ routine: updatedRoutine });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(routine ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a routine which is not yours"
        } : {
          name: "RoutineNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });


// POST /api/routines/:routineId/activities
// fetch('http://fitnesstrac-kr.herokuapp.com/api/routines/6/activities', {
//   method: "POST",
//   body: JSON.stringify({
//     activityId: 7,
//     count: 1, 
//     duration: 20
//   })
// }).then(response => response.json())
//   .then(result => {
//     console.log(result);
//   })
//   .catch(console.error);
routinesRouter.post('/', requireUser, async (req, res, next) => {

  
    try {
    
      const routine = await createRoutine();
  
      if (routine) {
        res.send(post);
      } else {
        next({
          name: 'PostCreationError',
          message: 'There was an error creating your post. Please try again.'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


module.exports = router;