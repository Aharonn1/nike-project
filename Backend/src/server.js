// const mysql = require('mysql');
// const cors = require('cors');
// const express = require('express');

// const app = express();
// app.use(express.json());

// app.use(cors());
// const db = mysql.createConnection({
//      host : "localhost",
//      mysqlUser : "root",
//      mysqlPassword : "",
//      mysqlDatabase : "nike"   
// })

// app.post("/auth/login",(res,req) =>{
//     const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

//     db.query(sql,[req.body.email , req.body.password], (err,data) =>{
//         if(err) return res.json("Error");
//         if(data.length > 0){
//             return res.json("Login Successfully");
//         } else{
//             return res.json("No Record");

//         }
//     })
// })

// // app.listen(4021,() =>{
// //     console.log("Listening...")
// // })

// app.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));