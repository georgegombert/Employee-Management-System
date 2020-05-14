const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "myCompany_DB"
});

connection.connect( (err) => {
  if (err) throw err;
  main();
});

const main = () => {
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
        console.log(answer.userChoice);
        break;

      case "Add Role":
        console.log(answer.userChoice);
        break;

      case "Add Employee":
        console.log(answer.userChoice);
        break;

      case "View Departments":
        console.log(answer.userChoice);
        break;

      case "View Roles":
        console.log(answer.userChoice);
        break;
      case "View Employees":
        console.log(answer.userChoice);
        break;
      case "Exit":
        connection.end(err => console.log("Goodbye"));
        break;
      }
    });
}