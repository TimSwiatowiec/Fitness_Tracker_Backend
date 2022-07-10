const express = require('express');
const activitiesRouter = express.Router();
// const requireUser = require('./utils');
const {updateActivity, createActivity, getAllActivities, getPublicRoutinesByActivity} = require('../db')
// const { getAllActivities, updateActivity, createActivity, getPublicRoutinesByActivity } = require('../db');

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
    const { activityId } = req.params;
    try {
        const routines = await getPublicRoutinesByActivity(activityId);
        res.send(routines);
    } catch ({ name, message }) {
        ({ name, message })
    };
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
    const activities = await getAllActivities();
    res.send({ activities });
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
activitiesRouter.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const activityData = { name, description }
        const activity = await createActivity(activityData);

        if (activity) {
            res.send(activity);
        } else {
            res.send({
                name: "CreateActivityError",
                message: "Must be logged in to create activity"
            })
        }
    } catch ({ name, message }) {
        res.send({ name, message });
    };
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

activitiesRouter.patch('/:activityId', async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;
    const updateFields = {};

    if (name) {
        updateFields.name = name;
    }

    if (description) {
        updateFields.description = description;
    }

    try {
        const updatedActivity = await updateActivity(activityId, updateFields);

        res.send({ activity: updatedActivity });
    } catch ({ name, message }) {
        res.send({ name, message });
    }
});
  

module.exports = activitiesRouter;