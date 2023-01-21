const express = require('express')
const cors = require('cors')
const bp = require('body-parser')

const app = express()

require('dotenv').config()

app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const users = []
const exercises = []

app.post('/api/users', (req, res) =>{
  const username = req.body.username
  const _id = users.length
  const user = {
    username,
    _id,
  }
  users.push(user)
  res.json(user)
})

app.get('/api/users', (req,res) =>{
  res.json(users)
})

app.post('/api/users/:_id/exercises', (req, res) =>{
  const description = req.body.description
  const duration = req.body.duration
  const date = req.body?.date || new Date()
  const _id = req.params._id

  const username = users.find(({_id})=> _id === _id)?.username

  const exercise = {
    description,
    duration,
    date,
    _id,
  }

  exercises.push(exercise)

  res.json({ username, ...exercise })
})

app.get('/api/users/:_id/logs/:from?/:to?/:limit?', (req,res) =>{
  const id = req.params._id
  //Optional params
  const from = req.query.from ?? new Date(-8640000000000000);
  const to = req.query.to ?? new Date(8640000000000000);
  const limit = req.query.limit

  const username = users.find(({_id}) => _id == id)?.username

  const log = exercises
    .filter(({_id, date})=> _id === id && date >= from && date <= to)
    .slice(0, limit)
    .map(({description, duration, date}) => ({
      description,
      duration: Number(duration),
      date: date.toDateString(),
    }))
    
  const result = {
    username,
    count: log.length,
    _id: id,
    log
  }
  
  res.json(result)
})