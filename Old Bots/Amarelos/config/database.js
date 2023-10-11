const mongoose = require('mongoose');

class Database {
    constructor() {
        this.conection = null;
    }

    connect() {
        const mongo_url = "mongodb+srv://ae7680:RxNk3RlpyMKAgiv1@cluster0.jmoehl5.mongodb.net/?retryWrites=true&w=majority";;
            console.log('Tentando conexão com banco de dados...')
        mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Conectado com o banco de dados.');
            this.connect = mongoose.connection;   
        }).catch(err => {
            console.error(err);
        });
    }
}

module.exports = Database; 
