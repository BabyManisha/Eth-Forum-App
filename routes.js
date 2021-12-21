const routes = require('next-routes')();

routes
    .add('/topic/:topicID',  '/topic')
    // .add('/topic/new', '/topic/new')
    // .add('/topic/:index/new',  '/topic/show')

module.exports = routes;
