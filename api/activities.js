const express = require('express');
const router = express.Router();

// GET /api/activities/:activityId/routines
fetch('http://fitnesstrac-kr.herokuapp.com/api/activities/3/routines', {
  headers: {
    'Content-Type': 'application/json',
  },
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

// GET /api/activities
fetch('http://fitnesstrac-kr.herokuapp.com/api/activities', {
  headers: {
    'Content-Type': 'application/json',
  },
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

// POST /api/activities
fetch('http://fitnesstrac-kr.herokuapp.com/api/activities', {
  method: "POST",
  body: JSON.stringify({
    name: 'Running',
    description: 'Keep on running!'
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);


// PATCH /api/activities/:activityId
fetch('http://fitnesstrac-kr.herokuapp.com/api/activities/9', {
  method: "PATCH",
  body: JSON.stringify({
    name: 'Running',
    description: 'Keep on running, til you drop!'
  })
}).then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(console.error);

module.exports = router;