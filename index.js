const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express()

const conn = require('./db/conn');

//Models
const Tought = require('./models/Tought');
const User = require('./models/User');

//Routes import
const toughtsRoutes = require('./routes/toughtsRouter');
const authRoutes = require('./routes/authRouter');

//import controller pagina principal 
const ToughtController = require('./controllers/ToughtController');

// template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

//resposta body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//session middleware
app.use(session({
  name: 'session',
  secret: 'nosso_secret',
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    logFn: () => {},
    path: require('path').join(require('os').tmpdir(), 'sessions'),
  }),
  cookie: {
    secure: false,
    maxAge: 360000,
    expires: new Date(Date.now() + 360000),
    httpOnly: true
  }
}));

//resposta da session
app.use((req, res, next) => {
  if(req.session.userId) {
    res.locals.session = req.session
  }

  next();
})

//flash messages
app.use(flash());

//assets do projeto
app.use(express.static('public'));

// Routes
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);


app.get('/', ToughtController.showToughts);

conn.sync().then(() =>{
  app.listen(3000);
}).catch((err) => console.log(err));