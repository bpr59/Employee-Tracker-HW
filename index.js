const mysql =require('mysql');
const express =require('express')
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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
    var sql = 'SET @id = ?; SET @firstName = ?; SET @lastName = ?; SET @role = ?; SET @manager = ?; \
    CALL employeeAddOrEdit(@id,@firstName,@lastName,@role,@manager);';
    mysqlConnection.query(sql,[emp.id, emp.firstName, emp.lastName, emp.role, emp.manager], (err, rows, fields) =>{
        if(!err)
        rows.forEach(element => {
            if (element.constructor == Array)
            res.send('Inserted employee id : ' + element[0].id);         
        });
        else
        console.log(err);
    })    
});