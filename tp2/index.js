// Import a module
const express = require('express')
var app = express()

app.set('port', 8080)

require('./handles')(app)

app.listen(app.get('port'), () => {
    console.log('server listening on port ' + app.get('port'))
})