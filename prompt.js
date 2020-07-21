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
      // based on their answer, either call the bid or the post functions
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

// function to handle posting new items up for auction
function showEmployees() {
      // when finished prompting, insert a new item into the db with that info
      mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) =>{
        if(!err)
        res.send(rows);
        //console.log(rows);
        else
        console.log(err);
    }) 
    };


// function empDepartment() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }

//module.exports = prompt;