const express = require('express');
const router = express.Router();

// GET /api/routines
fetch('http://fitnesstrac-kr.herokuapp.com/api/routines', {
  headers: {
    'Content-Type': 'application/json',
  },
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

// POST /api/routines
fetch('http://fitnesstrac-kr.herokuapp.com/api/routines', {
  method: "POST",
  body: JSON.stringify({
    name: 'Long Cardio Routine',
    goal: 'To get your heart pumping!',
    isPublic: true
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

// PATCH /api/routines/:routineId
fetch('http://fitnesstrac-kr.herokuapp.com/api/routines/6', {
  method: "PATCH",
  body: JSON.stringify({
    name: 'Long Cardio Day',
    goal: 'To get your heart pumping!'
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

// DELETE /api/routines/:routineId
fetch('http://fitnesstrac-kr.herokuapp.com/api/routines/6', {
  method: "DELETE",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN_STRING_HERE'
  }
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

// POST /api/routines/:routineId/activities
fetch('http://fitnesstrac-kr.herokuapp.com/api/routines/6/activities', {
  method: "POST",
  body: JSON.stringify({
    activityId: 7,
    count: 1, 
    duration: 20
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

module.exports = router;