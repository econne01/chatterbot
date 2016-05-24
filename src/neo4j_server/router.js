var router = require('express').Router();
var botResponseService = require('./services/botResponseService');

router.get('/', function(request, response) {
    response.type('txt').send('Chatterbot Neo4j main API');
});

router.get('/respondTo', botResponseService.GET);

module.exports = router;