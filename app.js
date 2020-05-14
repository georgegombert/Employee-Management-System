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
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
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

function addDepartment() {
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
function addRole() {
  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "What is the name of the new role?"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Enter the salary for this role:"
      }
    ])
    .then(answer => {
      connection.query("INSERT INTO role (title, salary) VALUE ('"+answer.roleName.trim()+"','"+answer.roleSalary+"')" ,err => {
        if (err) throw err;
        viewRoles();
    })
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the first name of the employee?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the last name of the employee?"
      }
    ])
    .then(answer => {
      connection.query("INSERT INTO employee (first_name, last_name) VALUE ('"+answer.firstName.trim()+"','"+answer.lastName.trim()+"')" ,err => {
        if (err) throw err;
        viewEmployees();
    })
  });
}