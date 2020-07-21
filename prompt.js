const mysql =require('mysql');
const express =require('express')
const app = express();
const inquirer = require("inquirer");
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_trackerDB',
    multipleStatements : true
});

mysqlConnection.connect((err) =>{
    if(!err)
    console.log('DB connection active');
    else
    console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
    start();
})

app.listen(3000,()=>console.log('Express server is listening at port 3000!'));

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "options",
      type: "list",
      message: "What would you like to do?",
      choices: [
          "View all employees", 
          "View all employees by department", 
          "View all employees by manager",
          "View all roles",
          "Add employee", 
          "Remove employee", 
          "Update employees role",
          "Update employees manager"
        ]
    })
    .then(function(answer) {
      
      if (answer.options === "View all employees") {
        showEmployees();
      }
      else if(answer.options === "View all employees by department") {
        empDepartment();
      } 
      else if(answer.options === "View all employees by manager") {
        empManager();
      } 
      else if(answer.options === "View all roles") {
        viewRoles();
      } 
      else if(answer.options === "Add employee") {
        addEmployee();
      } 
      else if(answer.options === "Remove employee") {
        removeEmployee();
      } 
      else if(answer.options === "Update employee role") {
        updateRole();
      } 
      else if(answer.options === "Update employee manager") {
        updateManager();
      } else{
        connection.end();
      }
    });
}

function showEmployees() {
      mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) =>{
        if(!err)
        console.table(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function empDepartment() {
      mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function empManager() {
      mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function viewRoles() {
      mysqlConnection.query('SELECT * FROM role', (err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function addEmployee() {
      mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function removeEmployee() {
      mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function updateRole() {
      mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function updateManager() {
      mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
    }) 
    };

//module.exports = prompt;