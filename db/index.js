const {films_data, people_data} = require('./data')
const Sequelize = require('sequelize')
const {STRING, UUID, UUIDV4, TEXT, INTEGER} = Sequelize
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_s_db')

const Film = conn.define ('film', {
  id: {type: STRING(50), primaryKey: true},
  title: {type: STRING(100)},
  image: {type: STRING(2500)},
  movie_banner: {type: STRING(2500)},
  description: {type: TEXT},
  director: {type: STRING(100)},
  producer: {type: STRING(100)},
  release_date: {type: STRING(50)},
  running_time: {type: STRING(50)},
  rt_score: {type: STRING(50)}
})

const Person = conn.define( 'person',{
  id: {type: STRING(50), primaryKey: true},
  name:{type: STRING(100)},
  gender: {type: STRING(100)},
  age: {type: STRING(100)},
  eye_color: {type: STRING(100)},
  hair_color: {type: STRING(100)},
})


const Connect = conn.define('connect', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  }
})

const PersonFilm = conn.define('person_film');


Connect.belongsTo(Person, {as: 'character'})
Person.hasMany(Connect, {foreignKey: 'characterId'})
Connect.belongsTo(Film)
Film.hasMany(Connect)


Person.belongsToMany(Film, {through: PersonFilm})
Film.belongsToMany(Person, {through: PersonFilm})

PersonFilm.hasMany(Person, {foreignKey: 'personId'})
PersonFilm.hasMany(Film, {foreignKey: 'filmId'})

const syncAndSeed = async()=>{
  await conn.sync({force: true})
  await Promise.all(films_data.map((ele) => Film.create({ 
    id: ele.id, 
    title: ele.title, 
    image: ele.image,
    movie_banner: ele.movie_banner,
    description: ele.description,
    director: ele.director,
    producer: ele.producer,
    release_date: ele.release_date,
    running_time: ele.running_time,
    rt_score: ele.rt_score})));
  await Promise.all(people_data.map((ele) => Person.create({ 
    id: ele.id,
    name: ele.name,
    gender: ele.gender,
    age: ele.age,
    eye_color: ele.eye_color,
    hair_color: ele.hair_color})));
  await Promise.all(
    films_data.map((film)=> {
      people_data.filter(ele => {
        if(ele.films.includes(`https://ghibliapi.herokuapp.com/films/${film.id}`)){
          Connect.create({
            filmId: film.id, characterId: ele.id 
          })
          }
        }
      )
    })
  )
  await Promise.all(
    films_data.map((film)=> {
      people_data.filter(ele => {
        if(ele.films.includes(`https://ghibliapi.herokuapp.com/films/${film.id}`)){
          PersonFilm.create({
            filmId: film.id, personId: ele.id 
          })
          }
        }
      )
    })
  )

}

module.exports ={
  syncAndSeed,
  models: {
    Film,
    Person,
    Connect,
    PersonFilm
  },
  conn
}