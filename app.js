const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const store = new session.MemoryStore();
const cors = require('cors');

const app = express();

const { SESSION_SECRET, SESSION_NAME, SESSION_EXPIRE_AT, PORT  } = require('./config/constants/app.constants');

app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    cookie: { maxAge: SESSION_EXPIRE_AT },
    saveUninitialized: false,
    store
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(express.static('public'));
app.use('/assets/js', express.static(__dirname + 'public/assets/js'))

app.use(expressLayouts)
app.set('view engine', 'ejs')


const APIRoute = require('./routes/api.routes');
APIRoute(app);



let port = PORT || 3060;;
app.listen(port, () => console.log(`Running on port ${port}`))
