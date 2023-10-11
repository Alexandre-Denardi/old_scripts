const mysql = require('mysql2/promise')
const config = require('../config.json')

let connected = 0
async function connect() {
    try {
        if (connected == 0) {
            connected = 1
            console.log("Conectando")
            const connection = await mysql.createConnection({
                host: config.db.host,
                user: config.db.user,
                password: config.db.password,
                database: config.db.database,
                connectTimeout: 8 * 60 * 60 * 1000
            });
            console.log("Banco de dados Online");
            global.connection = connection;
            return connection;
        } else {
            clearInterval(timer)
            const conne = await global.connection
            var timer = setInterval(function () {
                conne.query('SELECT * FROM `horas` ORDER BY ID DESC LIMIT 1;')
            }
                , 28700000)
            return global.connection;
        }
    } catch (error) {
        console.error("Erro na conexão com o banco de dados", error);
        setTimeout(connect(), 5000);
    }
}
connect()

async function reConnect() {
    connected = 0
    connect()
}


async function HoraEntrada(ServerID, UserID, Entrada) {
    try {
        const conn = await connect();
        const sql1 = 'INSERT INTO `horas` ( `ServerID`, `UserID` , `DEnter` ) VALUES ( ? , ? , ? );'
        const values1 = [ServerID, UserID, Entrada]
        await conn.query(sql1, values1);
    } catch (err) {
        reConnect()
        HoraEntrada(ServerID, UserID, Entrada)
    }
}


async function HoraSaida(ServerID, UserID, Saida) {
    try {
        const conn = await connect();

        // consultando a ultima entrada em call no servidor 
        const sql1 = 'SELECT * FROM `horas` WHERE ServerID = ? AND UserID = ? ORDER BY ID DESC LIMIT 1;'
        const values1 = [ServerID, UserID]
        const [rows] = await conn.query(sql1, values1);
        if (rows.length != 0) {
            if (rows[0].DExit == null) {
                const ID = rows[0].ID
                const sql2 = 'UPDATE `horas` SET DExit = ? WHERE ID = ?;'
                const values2 = [Saida, ID]
                conn.query(sql2, values2)
            }
        }
    } catch (error) {
        reConnect()
        HoraSaida(ServerID, UserID, Saida)
}}

async function ContadorLastCall(ServerID, UserID) {
    try {
        const conn = await connect();
        const sql1 = 'SELECT * FROM `horas` WHERE ServerID = ? AND UserID = ? ORDER BY ID DESC LIMIT 1;'
        const values1 = [ServerID, UserID]
        const [rows] = await conn.query(sql1, values1);
        return rows
    } catch (error) {
        reConnect()
        return ContadorLastCall(ServerID, UserID)
    }
}

async function ConsultUserCallTime(ServerID, UserID) {
    try {
        const conn = await connect();
        const sql1 = 'SELECT * FROM `horas` WHERE ServerID = ? AND UserID = ? '
        const values1 = [ServerID, UserID]
        const [rows] = await conn.query(sql1, values1);
        return rows
    } catch (error) {
        reConnect()
        return ConsultUserCallTime(ServerID, UserID)
}}


// Ranking do servidor 
async function CreateRanking(ServerID, UserID) {
    try {
        const conn = await connect();
        const sql1 = 'INSERT INTO `callranking` ( `ServerID`, `UserID` ) VALUES ( ? , ? );'
        const values1 = [ServerID, UserID]
        const [rows] = await conn.query(sql1, values1);
        return rows
    } catch (err) {
        reConnect()
        return CreateRanking(ServerID, UserID)
    }
}

async function ConsultUserRanking(ServerID, UserID) {
    try {
        const conn = await connect();
        const sql1 = 'SELECT * FROM `callranking` WHERE ServerID = ? AND UserID = ? '
        const values1 = [ServerID, UserID]
        const [rows] = await conn.query(sql1, values1);
        return rows
    } catch (error) {
        reConnect()
        ConsultUserRanking(ServerID, UserID)
}}

async function UpdateRanking(ServerID, UserID, Seconds) {
    try {
        const conn = await connect();

        // consultando a ultima entrada em call no servidor 
        const sql1 = 'SELECT * FROM `callranking` WHERE ServerID = ? AND UserID = ?'
        const values1 = [ServerID, UserID]
        const [rows] = await conn.query(sql1, values1);
        if (rows.length == 0) {
            const sql = 'INSERT INTO `callranking` ( `ServerID`, `UserID`, `TimeTotal` ) VALUES ( ? , ? , ?);'
            const values = [ServerID, UserID, Seconds]
            await conn.query(sql, values);
        } else {

            if (rows[0].TimeTotal != NaN) {
                SecondsTotal = parseInt(rows[0].TimeTotal) + Seconds
            } else {
                SecondsTotal = Seconds
            }
            const ID = rows[0].ID
            const sql2 = 'UPDATE `callranking` SET TimeTotal = ? WHERE ID = ?;'
            const values2 = [SecondsTotal, ID]
            const [rows2] = await conn.query(sql2, values2)
            return rows2
        }
    } catch (error) {
        reConnect()
        UpdateRanking(ServerID, UserID, Seconds)
}}

async function ConsultAllRanking(ServerID, UserID) {
    try {
        const conn = await connect();
        const sql1 = 'SELECT * FROM `callranking` WHERE ServerID = ? AND UserID = ? ORDER BY TimeTotal DESC LIMIT 10;'
        const values1 = [ServerID, UserID]
        const [rows] = await conn.query(sql1, values1);
        return rows
    } catch (error) {
        reConnect()
        ConsultAllRanking(ServerID, UserID)
}}


// Tickets
async function consultTicket(ServerID, member, tipo) {
    try {
        if (tipo == '*') {
            const conn = await connect();
            const sql1 = 'SELECT * FROM `ticket` WHERE guild = ? AND member = ? AND status = ?'
            const values1 = [ServerID, member, "1"]
            const [rows] = await conn.query(sql1, values1);
            return rows
        } else {
            const conn = await connect();
            const sql2 = 'SELECT * FROM `ticket` WHERE guild = ? AND member = ? AND tipo = ? AND status = ?'
            const values2 = [ServerID, member, tipo, "1"]
            const [rows2] = await conn.query(sql2, values2);
            return rows2
        }
    } catch (error) {
        reConnect()
        consultTicket(ServerID, member, tipo)
}}

async function createTicket(ServerID, member, tipo, chat) {
    try {
        const conn = await connect();
        const sql = 'INSERT INTO `ticket` ( `guild`, `member`, `chat`, `tipo`, `status`,  `createDate`  ) VALUES ( ? , ? , ? , ? , ? , ?);'
        const values = [ServerID, member, chat, tipo, "1", new Date()]
        await conn.query(sql, values);
    } catch (error) {
      reConnect()
      createTicket(ServerID, member, tipo, chat)
}}

async function finalizaTicket(chat) {
    try {
        const conn = await connect();
        const sql1 = 'SELECT * FROM `ticket` WHERE `chat` = ?'
        const values1 = [chat]
        const [rows] = await conn.query(sql1, values1);
        const ID = await rows[0].ID
        const sql2 = 'UPDATE `ticket` SET status = ?, endDate = ? WHERE id = ?;'
        const values2 = ["0", new Date(), ID]
        await conn.query(sql2, values2)
    } catch (error) {
        reConnect()
        finalizaTicket(chat)
}}

async function consultTicketDM(chat) {
    try {
        const conn = await connect();
        const sql1 = 'SELECT member,tipo FROM `ticket` WHERE chat = ? '
        const values1 = [chat]
        const [rows] = await conn.query(sql1, values1);
        return rows 
    } catch (error) {
      reConnect()
      consultTicketDM(chat)
}}


module.exports = {
    HoraEntrada, HoraSaida, ContadorLastCall, ConsultUserCallTime, CreateRanking, ConsultUserRanking, UpdateRanking,
    ConsultAllRanking, consultTicket, createTicket, finalizaTicket, consultTicketDM
}