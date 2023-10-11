async function connect(){
const mysql = require('mysql')
const db = mysql.createConnection({
    host:"sql10.freesqldatabase.com",
    user:"sql10583580",
    password: "XkCrkB9mxl",
    database: "sql10583580"
})
 db.connect(function(err) {
    if (err) throw err;
    console.log("Banco de dados Online")
 })
}
connect();



module.exports = {}