require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const config = {}
config.serverPort = process.env.SERVER_PORT

console.log(`environment==>`, process.env.NODE_ENV)
console.log(`server port==>`, process.env.SERVER_PORT)


config.dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
}


console.log(`db name======>`, config.dbConfig.database)
module.exports = config