const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require('chalk');
const cTable = require('console.table');
const testName = "test";

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "myCompany_DB"
});

connection.connect(err => {
  if (err) throw err;
  main();
});

function main() {
  console.log("hello working");
  inquirer
    .prompt({
      name: "userChoice",
      type: "list",
      message: "Welcome to the EMS homepage. Select one of the options below:",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View Departments",
        "View Roles",
        "View Employees",       
        "Exit"
      ]
    })
    .then(answer => {
      switch (answer.userChoice) {
        case "Add Department":
          console.log(chalk.inverse(answer.userChoice));
          addDepartments();
          break;

        case "Add Role":
          console.log(answer.userChoice);
          break;

        case "Add Employee":
          console.log(answer.userChoice);
          break;

        case "View Departments":
          console.log(answer.userChoice);
          viewDepartments();
          break;

        case "View Roles":
          viewRoles();
          break;
        case "View Employees":
          viewEmployees();
          break;
        case "Exit":
          connection.end(err => console.log("Goodbye"));
          break;
      }
    });
}

function viewDepartments() {
  connection.query("SELECT * FROM department", (err, res) => {
    console.table(res);
    returnHome();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", (err, res) => {
    console.table(res);
    returnHome();
  });
}

function viewEmployees() {
  connection.query("SELECT * FROM employee", (err, res) => {
    console.table(res);
    returnHome();
  });
}

function returnHome() {
  inquirer
    .prompt({
      name: "returnChoice",
      type: "list",
      message: " ",
      choices: ["Continue", "Exit"]
    })
    .then(answer => {
      switch(answer.returnChoice){
        case "Continue":
          main();
          break;

        case "Exit":
          connection.end(err => console.log("Goodbye"));
          break;
      }
    });

}

function addDepartments() {
  inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "What is the name of the new department?"
    })
    .then(answer => {
      connection.query("INSERT INTO department (name) VALUE ('"+answer.departmentName.trim()+"')" ,err => {
        if (err) throw err;
        viewDepartments();
    })
  });
}