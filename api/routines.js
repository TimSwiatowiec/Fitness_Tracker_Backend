const express = require('express');
const { getAllRoutines } = require('../db');
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get('/', async (req, res) => {
    try {
        const routines = await getAllRoutines();

        res.send({
            routines
        })
    } catch ({ name, message }) {
        next({ name, message, })
    }
 });
// POST /api/routines
routinesRouter.post('/routines', async(res, req, next) =>{

})
// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', async(res, req, next) =>{

})
// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', async(res, req, next) =>{

})
// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async(res, req, next) =>{
    
})
module.exports = router;
