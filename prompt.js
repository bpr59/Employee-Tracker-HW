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
          "Update employee role",
          "Update employee manager"
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

    function getRoles() {
      return new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT role.title FROM role', function(err, results) {
          if (err) return reject(err);
          let roleNames = [];
          for (var i = 0; i < results.length; i++){
            roleNames.push(results[i].title);
            // console.log("Titles", roleNames)
          }
          return resolve(roleNames);
        })
      })
    }

    function getEmployees(){
      return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT employee.first_name, employee.last_name FROM employee", function(err, results) {
          if (err) return reject(err);
          let employeeNames = [];
          for (var i = 0; i < results.length; i++){
              employeeNames.push(results[i].first_name + " " + results[i].last_name);
              // console.log("All Employees:", employeeNames)
          }
          return resolve(employeeNames);
        })
      });
    }

    function addEmployee() {

      let employee_id;
      let manager_id;

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
            type: "list",
            name: "role_id",
            message: "Select a role for the new employee",
            choices: getRoles
          },
          {
            type: "list",
            name: "manager_id",
            message: "Select a manager for the new employee",
            choices: getEmployees
          },
        ])
        .then(function(res) {
          console.log("response", res);

          mysqlConnection.query(
            "SELECT id FROM role WHERE ?",
            { title: res.role_id }, (err, department) => {
              if (err) throw err;
            let employeeFirstName = res.manager_id.split(" ").slice(0, -1).join(" ");
            let employeeLastName = res.manager_id.split(" ").slice(-1).join(" ");
          
            manager_id = department[0].id
            mysqlConnection.query(
            "SELECT id FROM employee WHERE ? AND ?",
            [{ first_name: employeeFirstName }, { last_name: employeeLastName }],
            function (err, role_id) {
              employee_id = role_id[0].id
              if (err) {
                console.log(err);
                throw err;
              }
          var sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
          
          mysqlConnection.query(sql, [res.first_name, res.last_name, employee_id, manager_id ], 
            function(err,res) {
            if (err) throw err; 
            console.log(res);
                start()
          });
        })
    })
  });
}

    function removeEmployee() {
      inquirer
        .prompt([
          {
            type: "list",
            name: "manager_id",
            message: "Select an employee to remove",
            choices: getEmployees
          },
          ])

    .then(function(result) {

       let employeeFirstName = result.manager_id.split(" ").slice(0, -1).join(" ");
       let employeeLastName = result.manager_id.split(" ").slice(-1).join(" ");

      mysqlConnection.query('DELETE FROM employee WHERE first_name = ? and last_name = ?', [employeeFirstName,employeeLastName],(err, rows, fields) =>{
        if(!err)
        console.log(rows);
        else
        console.log(err);
        start();
      });
    });  
    }

    function updateRole() {
      inquirer
        .prompt([
        {
          type: "list",
          name: "role_id",
          message: "Select an employee to update role",
          choices: getEmployees
        },
          {
            type: 'list',
            name: "role_title",
            message: "Select a new role for the employee",
            choices: getRoles
          },
          ])

        .then(function (res) {
          var sql = 'INSERT INTO employee (role.id, role.title) VALUES (?, ?)';
          console.log(res);
          mysqlConnection.query(sql,[res.role.id, res.role.title], (err, rows, fields) =>{
            if(!err)
            console.log(rows);
            else
            console.log(err);
            start();
        });
      });
    } 

    function updateManager() {
      inquirer
        .prompt([
            {
            type: "list",
            name: "role_id",
            message: "Select an employee to update role",
            choices: getEmployees
            },
            {
            type: "list",
            name: "manager_id",
            message: "Select a manager for the employee",
            choices: getEmployees
            }
          ])

          .then(function(newManager) {
            var sql = 'SELECT employee AS role_id FROM employee INNER JOIN id ON role = department_id';
            console.log(newManager);
            mysqlConnection.query(sql,[newManager.manager_id], (err, rows, fields) => {
              if(!err)
            console.log(rows);
            else
            console.log(err);
            start();
            });
          }) 
    };

  };

  // module.exports = {
  //   start,
  //   showEmployees,
  //   empDepartment,
  //   empManager,
  //   viewRoles,
  //   addEmployee,
  //   removeEmployee,
  //   updateRole,
  // updateManager
  // }:
