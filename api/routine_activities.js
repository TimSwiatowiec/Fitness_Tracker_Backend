const express = require('express');
const routineActivitiesRouter = express.Router();
const { requireUser } = require('.utils'); 

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', async(res, req, next) =>{

})
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', async(res, req, next) =>{

})
module.exports = router;
