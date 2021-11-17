const {conn, syncAndSeed, models: {Person, Film, Connect, PersonFilm }} = require('./db')

const express = require('express')
const { Connection } = require('pg')
const app = express()

app.get ('/api/films', async(req, res, next)=>{
  try{
    res.send(await Film.findAll({
      include:[Connect]
    }))
  }
  catch(ex){
    next(ex)
  }
})
app.get ('/api/people', async(req, res, next)=>{
  try{
    res.send(await Person.findAll({
      include:[Connect]
    }))
  }
  catch(ex){
    next(ex)
  }
})

app.get ('/api/connect', async(req, res, next)=>{
  try{
    res.send(await Connect.findAll({
      include:[
        {
          model:Person,
        as: 'character'
      },
        Film
    ]
    }))
  }
  catch(ex){
    next(ex)
  }
})

app.get ('/api/person_film', async(req, res, next)=>{
  try{
    res.send(await PersonFilm.findAll({
      include: [
        Film
      ]
    }))
  }
  catch(ex){
    next(ex)
  }
})

const init = async()=>{
  try{
    await syncAndSeed()
    const port =process.env.PORT || 3000
    app.listen(port, ()=> console.log(`listening on port ${port}`))

    await conn.authenticate()
  }
  catch(ex){
    console.log(ex)
  }
}
init()