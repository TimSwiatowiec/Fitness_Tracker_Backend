const express = require('express');
// const { destroyRoutine } = require('../db/routines');
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
routinesRouter.get('/', async (req, res) => {
    const routines = await getAllRoutines();
    res.send({ routines });
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
            const { public, name, goal } = req.body;
            const routineData = { creatorId: req.user.id, public, name, goal };
            const routine = await createRoutine(routineData);
    
            if (routine) {
                res.send({ routine });
            } else {
                next({
                    name: "CreateRoutineError",
                    message: "Must be logged in to create routine"
                })
            }
        } catch ({ name, message }) {
            next({ name, message });
        };
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
    const { routineId } = req.params;
    const { public, name, goal } = req.body;

    const updateFields = {};

    if (name) {
        updateFields.name = name;
    };

    if (goal) {
        updateFields.goal = goal;
    };

    if (public) {
        updateFields.public = public;
    };

    try {
        const originalRoutine = await getRoutineById(routineId);
        console.log("Original Routine: ", originalRoutine);
        console.log("creatorId", originalRoutine.creatorId)

        if(originalRoutine.creatorId === req.user.id) {
            const updatedRoutine = await updateRoutine(routineId, updateFields);
            res.send({ routine: updatedRoutine });
        } else {
            next({ message: "You cannot update a routine you did not create!"});
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});


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
    const { routineId } = req.params;

    try {
        const routine = await getRoutineById(routineId);

        if (routine.creatorId === req.user.id) {
            await deleteRoutine(routineId);
            console.log('routine has been deleted!');
            res.send('routine has been deleted!')
        } else {
            next({ message: "You must be the owner of the routine to delete it!"})
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
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
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const { creatorId } = await getRoutineById(routineId);


    try {
        if (creatorId === req.user.id) {
        const routineActivity = await addActivityToRoutine({routineId, activityId, count, duration});
        res.send({ routineActivity });
        } else {
            next({ message: "You are not authorized to update routine!"})
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});


module.exports = router;