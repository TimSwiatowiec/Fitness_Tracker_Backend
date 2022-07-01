const express = require('express');
const { getAllActivities, createActivity } = require('../db');
const activitiesRouter = express.Router();

// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) =>{

})
// GET /api/activities
activitiesRouter.get('/', async (req, res) => {
    try {
        const activities = await getAllActivities();

        res.send({
            activities
        })
    } catch ({ name, message }) {
        next({ name, message, })
    }
 });

// POST /api/activities
activitiesRouter.post('/activities', async(req, res, next) =>{

})
// PATCH /api/activities/:activityId
activitiesRouter.patch('/:activityId', async(req, res, next) =>{

})
module.exports = router;