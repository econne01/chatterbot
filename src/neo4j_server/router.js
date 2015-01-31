var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
    response.type('txt').send('Chatterbot Neo4j main API');
});

module.exports = router;