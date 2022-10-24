const UserRouter = require('./users.routes');
const ViewRouter = require('./views.routes');

/**
* DOCU: Function to designate all api requests to specific routes
* Triggered: This is being calledin all api requests on the website <br>
* Last Updated Date: October 23, 2022
* @async
* @function
* @author Jomar
*/
let APIRoute = (app) => {
    app.use('/api/users', UserRouter);
    app.use('/', ViewRouter);
}

module.exports = APIRoute;