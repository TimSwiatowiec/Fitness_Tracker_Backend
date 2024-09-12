// const client = require('pg')
// require and re-export all files in this db directory (users, activities...)
// require all API files
module.exports = {
...require('./users'), // adds key/values from users.js
...require('./activities'),
...require('./routines'),
...require('./routine_activities')
}