import express = require('express')
import bodyparser = require('body-parser')
import path = require('path')
import morgan = require('morgan')
import session = require('express-session')
import levelSession = require('level-session-store')
import dotenv = require('dotenv')

dotenv.config()

//console.log('name: ', process.env.ENVNAME)

const LevelStore = levelSession(session)

import { MetricsHandler, Metric } from './metrics'
import { UserHandler, User } from './user'
import { callbackify } from 'util';
import { LevelDb } from "./leveldb";

const app = express()
const port: string = process.env.PORT || '8080'

const db = LevelDb.open('./db/all')
const dbMet: MetricsHandler = new MetricsHandler(db)
const dbUser: UserHandler = new UserHandler(db)

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.use(morgan('dev'))

app.use(session({
  secret: 'this is a very secret secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.set('views', __dirname + '/../views')
app.set('view engine', 'ejs')

app.use('/', express.static(path.join(__dirname, '/../node_modules/jquery/dist')))
app.use('/', express.static(path.join(__dirname, '/../node_modules/bootstrap/dist')))

/*
  Authentication
*/

const authRouter = express.Router()

authRouter.get('/login', function (req: any, res: any) {
  res.render('login')
})

authRouter.post('/login', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    // if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

authRouter.get('/signup', function (req: any, res: any) {
  res.render('signup')
})

authRouter.get('/logout', function (req: any, res: any) {
  if (req.session.loggedIn) {
    delete req.session.loggedIn
    delete req.session.user
  }

  res.redirect('/login')
})

app.use(authRouter)

const authMiddleware = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

/*
  Root
*/

app.get('/', authMiddleware, (req: any, res: any) => {
  res.render('index', { name: req.session.user.username })
})

/*
  Users
*/

const userRouter = express.Router()

userRouter.get('/:username', function (req: any, res: any, next: any) {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})

userRouter.post('/', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (result !== undefined && result.username != undefined) {
      res.status(409).send("user already exists")
    }
    else {
      var user = new User(req.body.username, req.body.email, req.body.password)
      dbUser.save(user, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.delete('/:username', function (req: any, res: any, next: any) {
  dbUser.delete(req.params.username, function (err: Error | null) {
    if (err) res.status(404).send("user does not exist")
    res.status(200).send("user deleted")
  })
})

app.use('/user', userRouter)

/*
  Metrics
*/

const metricsRouter = express.Router()
metricsRouter.use(function (req: any, res: any, next: any) {
  console.log("metrics router")
  next()
})

metricsRouter.get('/all', (req: any, res: any, next: any) => {
  dbMet.getByUser(req.session.user.username, (err: Error | null, result?: Metric[]) => {
    if (err) next(err)
    if (result === undefined) {
      res.write('no result')
      res.send()
    } else res.json(result)
  })
})

metricsRouter.post('/add', (req: any, res: any, next: any) => {
  var met: Metric[] = []
  met.push(new Metric(req.body.timestamp, req.body.value))

  dbMet.save(req.body.key, req.session.user.username, met, (err: Error | null) => {
    if (err) next(err)
    res.status(200).send()
  })
})


metricsRouter.get('/:id', (req: any, res: any, next: any) => {
  dbMet.get(req.params.id, req.session.user.username, (err: Error | null, result?: Metric[]) => {
    if (err) next(err)
    if (result === undefined) {
      res.write('no result')
      res.send()
    } else res.json(result)
  })
})

metricsRouter.post('/:id', (req: any, res: any, next: any) => {
  dbMet.save(req.params.id, req.session.user.username, req.body, (err: Error | null) => {
    if (err) next(err)
    res.status(200).send()
  })
})

metricsRouter.delete('/:id', (req: any, res: any, next: any) => {
  dbMet.delete(req.params.id, req.session.user.username, (err: Error | null) => {
    if (err) next(err)
    res.status(200).send()
  })
})

app.use('/metrics', authMiddleware, metricsRouter)

/*
  Error handling
*/

app.use(function (err: Error, req: any, res: any, next: any) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`server is listening on port ${port}`)
})