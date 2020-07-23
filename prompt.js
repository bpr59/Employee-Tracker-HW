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
      switch (answer.options) {
      case "View all employees":
        showEmployees();
        break;

        case "View all employees by department":
        empDepartment();
        break;

        case "View all employees by manager":
        empManager();
        break;

        case "View all roles":
        viewRoles();
        break;

        case "Add employee":
        addEmployee();
        break;
        
        case "Remove employee":
        removeEmployee();
        break;

        case "Update employee role":
        updateRole();
        break;

        case "Update employee manager":
        updateManager();
        break;
      }
    });  
}

function showEmployees() {
      mysqlConnection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id', (err, rows, fields) =>{
        if(!err)
        console.table(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function empDepartment() {
      mysqlConnection.query('SELECT employee.first_name, employee.last_name, employee.role_id, department.dept_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, rows, fields) =>{
        if(!err)
        console.table(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function empManager() {
      mysqlConnection.query('SELECT employee.first_name, employee.last_name, role.title, manager_id FROM employee INNER JOIN role ON role.id = employee.role_id', (err, rows, fields) =>{
        if(!err)
        console.table(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function viewRoles() {
      mysqlConnection.query('SELECT * FROM role', (err, rows, fields) =>{
        if(!err)
        console.table(rows);
        else
        console.log(err);
        start();
    }) 
    };

    function addEmployee() {
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What's the employee's first name?"
          },
          {
            name: "last_name",
            type: "input",
            message: "What's the employee's last name?"
          },
          {
            name: "role",
            type: "input",
            message: "What would be the role of this employee?",
          },
          {
            name: "manager",
            type: "input",
            message: "Who would be the employee's manager?",

          }
        ])
        .then(function(emp) {
          var sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          console.log(emp);
          mysqlConnection.query(sql,[emp.first_name, emp.last_name, emp.role_id, emp.manager_id], (err, rows, fields) =>{
              if(!err)
              res.send('Employee added successfully.');
              else
              console.log(err);
              start();
          })    
        });
    }

    // function removeEmployee() {
    //   mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
    //     if(!err)
    //     console.log(rows);
    //     else
    //     console.log(err);
    //     start();
    // }) 
    // };

    // function updateRole() {
    //   mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
    //     if(!err)
    //     console.log(rows);
    //     else
    //     console.log(err);
    //     start();
    // }) 
    // };

    // function updateManager() {
    //   mysqlConnection.query('SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id', (err, rows, fields) =>{
    //     if(!err)
    //     console.log(rows);
    //     else
    //     console.log(err);
    //     start();
    // }) 
    // };

//module.exports = prompt;