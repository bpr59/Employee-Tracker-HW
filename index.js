const mysql =require('mysql');
const express =require('express')
const app = express();
const inquirer = require("inquirer");
const bodyparser = require('body-parser');

app.use(bodyparser.json());

//connection to mysql database

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
    mysqlConnection.query('SELECT * FROM employee WHERE id = ? ', [req.params.id], (err, rows, fields) =>{
        if(!err)
        res.send(rows);
        //console.log(rows);
        else
        console.log(err);
    })    
});

//Display all departments in DB
app.get('/department', (req, res) =>{
    mysqlConnection.query('SELECT * FROM department',[req.params.id], (err, rows, fields) =>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })    
});

//Display all roles in DB
app.get('/role', (req, res) =>{
    mysqlConnection.query('SELECT * FROM role',[req.params.id], (err, rows, fields) =>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })    
});

//Delete a specific employee from the DB
app.delete('/employee/:id', (req, res) =>{
    mysqlConnection.query('DELETE FROM employee WHERE id = ? ', [req.params.id], (err, rows, fields) =>{
        if(!err)
        res.send('Employee was deleted successfully');
        //console.log();
        else
        console.log(err);
    })    
});

//Insert a specific employee to the DB
app.post('/employee', (req, res) =>{
    let emp = req.body;
    var sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    console.log(emp);
    mysqlConnection.query(sql,[emp.first_name, emp.last_name, emp.role_id, emp.manager_id], (err, rows, fields) =>{
        if(!err)
        res.send('Employee added successfully.');
        else
        console.log(err);
    })    
});

//Insert a new department to the DB
app.post('/department', (req, res) =>{
    let dept = req.body;
    var sql = 'INSERT INTO department (dept_name) VALUES (?)';
    console.log(res);
    mysqlConnection.query(sql,[dept.dept_name], (err, rows, fields) =>{
        if(!err)
        res.send('Department added successfully.');
        else
        console.log(err);
    })    
});

//Insert a new role to the DB
app.post('/role', (req, res) =>{
    let role = req.body;
    var sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    console.log(res);
    mysqlConnection.query(sql,[role.title, role.salary, role.department_id], (err, rows, fields) =>{
        if(!err)
        res.send('Role added successfully.');
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

//function to start all necessary queries.

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
            "Add department",
            "Add role",
            "Remove employee", 
            "Update employee role"
          ]
      })

      //switch function to manage all queries and link to specific request query

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

          case "Add department":
          addDepartment();
          break;

          case "Add role":
          addRole();
          break;
  
          case "Remove employee":
          removeEmployee();
          break;
  
          case "Update employee role":
          updateRole();
          break;
        }
      });  
  
//function to display all employees in a table in Terminal

    function showEmployees() {
        mysqlConnection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id', (err, rows, fields) =>{
          if(!err)
          console.table(rows);
          else
          console.log(err);
          start();
      }) 
      };

//function to display all employees by department      
  
    function empDepartment() {
        mysqlConnection.query('SELECT employee.first_name, employee.last_name, employee.role_id, department.dept_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, rows, fields) =>{
          if(!err)
          console.table(rows);
          else
          console.log(err);
          start();
      }) 
      };
  
//function to display all employees by manager id  

    function empManager() {
        mysqlConnection.query('SELECT employee.first_name, employee.last_name, role.title, manager_id FROM employee INNER JOIN role ON role.id = employee.role_id', (err, rows, fields) =>{
          if(!err)
          console.table(rows);
          else
          console.log(err);
          start();
      }) 
      };

//function to display all available roles in database

      function viewRoles() {
        mysqlConnection.query('SELECT * FROM role', (err, rows, fields) =>{
          if(!err)
          console.table(rows);
          else
          console.log(err);
          start();
      }) 
      };

//Secondary function needed to access Role values to use in other queries      
  
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
  
//Secondary function needed to access list of employees to use in other queries 

    function getEmployees(){
      return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT employee.first_name, employee.last_name FROM employee", function(err, results) {
          if (err) return reject(err);
          let employeeNames = [];
          for (var i = 0; i < results.length; i++){
              employeeNames.push(results[i].first_name + " " + results[i].last_name);
          }
          return resolve(employeeNames);
        })
      });
    }

//Function to add new employee to the database      
  
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

  //function to process query response and deliver content to database

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
  
//Function to add a department to the database  

    function addDepartment() {

      let dept_name;

        inquirer
        .prompt([
          {
            name: "dept_name",
            type: "input",
            message: "What department would you like to add?"
          },
          ])

        //function to process query response and deliver content to database

        .then(function (res) {
          var sql = 'INSERT INTO department (dept_name) VALUES ( ? )';
          console.log("response", res);
          mysqlConnection.query(sql, [res.dept_name], (err, rows, fields) =>{
            console.log("dept", dept_name);
            if(!err)
            console.log(rows);
            else
            console.log(err);
            start();
        });
      });
    } 

    //Function to add a department to the database  

    function addRole() {

      let title;
      let salary;
      let department_id;

      inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What role would you like to add?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the starting salary?"
        },
        {
          name: "department_id",
          type: "input",
          message: "What is the department for this new role?"
        },
        ])

      //function to process query response and deliver content to database

      .then(function (res) {
        var sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        console.log("response", res);
        mysqlConnection.query(sql, [res.title, res.salary, res.department_id], (err, rows, fields) =>{
          console.log("title", title);
          if(!err)
          console.log(rows);
          else
          console.log(err);
          start();
      });
    });
  } 

//Function to delete employee from the database   

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
  
      //function to process query response and deliver content to database

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
  
//Function to update the role of the employee in the database  

      function updateRole() {
        
        inquirer
          .prompt([
          {
            type: "list",
            name: "empId",
            message: "Select an employee to update role",
            choices: getEmployees
          },
            {
              type: 'list',
              name: "roleId",
              message: "Select a new role for the employee",
              choices: getRoles
            },
            ])
  
          //function to process query response and deliver content to database

          .then(function (res) {
            var sql = 'UPDATE employee SET role_id = (SELECT id FROM role WHERE employee.role_id = id)';
            console.log("response", res);
            mysqlConnection.query(sql, [res.roleId, res.empId], (err, rows, fields) =>{
              if(!err)
              console.log(rows);
              else
              console.log(err);
              start();
          });
        });
      }

    }
    start();

