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
      mysqlConnection.query('SELECT employee.first_name, employee.last_name, role.title, manager_id FROM employee INNER JOIN role ON role.id = employee.role_id WHERE manager_id = "Manager"', (err, rows, fields) =>{
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
        .then(function(answer) {
          // when finished prompting, insert a new item into the db with that info
          connection.query(
            "INSERT INTO auctions SET ?",
            {
              item_name: answer.item,
              category: answer.category,
              starting_bid: answer.startingBid || 0,
              highest_bid: answer.startingBid || 0
            },
            function(err) {
              if (err) throw err;
              console.log("Your auction was created successfully!");
              // re-prompt the user for if they want to bid or post
              start();
            }
          );
        });
    }

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