const UserRouter = require('./users.routes');

let APIRoute = (app) => {
    app.use('/api/users', UserRouter);
    app.get('/', (req, res) => {
        let req_data = req;
        console.log(req.session)
        res.json({msg: "hey"})
    })
}

module.exports = APIRoute;