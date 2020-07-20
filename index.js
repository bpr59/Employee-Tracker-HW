const mysql =require('mysql');
const express =require('express')
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employeeDB',
    multipleStatements : true
});

mysqlConnection.connect((err) =>{
    if(!err)
    console.log('DB connection active');
    else
    console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
})

app.listen(3000,()=>console.log('Express server is listening at port 3000!'));

//Get all the employees in the DB
app.get('/employee', (req, res) =>{
    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) =>{
        if(!err)
        res.send(rows);
        //console.log(rows);
        else
        console.log(err);
    })    
});

//Get a specific employee from the DB
app.get('/employee/:id', (req, res) =>{
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ? ', [req.params.id], (err, rows, fields) =>{
        if(!err)
        res.send(rows);
        //console.log(rows);
        else
        console.log(err);
    })    
});

//Delete a specific employee from the DB
app.delete('/employee/:id', (req, res) =>{
    mysqlConnection.query('DELETE FROM employee WHERE EmpID = ? ', [req.params.id], (err, rows, fields) =>{
        if(!err)
        res.send('Employee was deleted successfully');
        //console.log();
        else
        console.log(err);
    })    
});

//Insert a specific employee from the DB
app.post('/employee', (req, res) =>{
    let emp = req.body;
    var sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    console.log(emp);
    mysqlConnection.query(sql,[emp.first_name, emp.last_name, emp.role_id, emp.manager_id], (err, rows, fields) =>{
        if(!err)
        res.send('Employee update was successful.');
        else
        console.log(err);
    })    
});

//Update a specific employee from the DB
app.put('/employee', (req, res) =>{
    let emp = req.body;
    var sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    console.log(emp);
    mysqlConnection.query(sql,[emp.first_name, emp.last_name, emp.role_id, emp.manager_id], (err, rows, fields) =>{
        if(!err)
        res.send('Employee update was successful.');
        else
        console.log(err);
    })    
});