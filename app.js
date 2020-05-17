const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const util = require('util');

let departmentArray = [];
let titleArray = [];
let employeeArray =[];

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "myCompany_DB"
});

connection.connect(err => {
  if (err) throw err;
  // test();
  main();
});

// creating a promise based query for async/await functions
const queryPromise = util.promisify(connection.query).bind(connection);

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
  let query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id"
  query += " FROM employee, role, department"
  query += " WHERE role.id = title_id AND department.id = department_id"

  connection.query(query, (err, res) => {
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

async function addEmployee() {
  try {
    await getRoleNames();
    await getEmployeeNames();
    const employeeChoices = employeeArray.map(employee => employee.first_name +" "+ employee.last_name);
    employeeChoices.push("None");
    const answers = await inquirer
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
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's title?",
          choices: titleArray.map(role => role.title)
        },
        {
          name: "manager",
          type: "list",
          message: "What is the employee's title?",
          choices: employeeChoices
        }
      ])
      
    // using inquirer answer to obtain title and manager id's from respective arrays
    const titleId = titleArray.filter(role => role.title === answers.role);
    let managerId = employeeArray.filter(manager => manager.first_name +" "+ manager.last_name === answers.manager);
    if(answers.manager === "None"){
      managerId =[{id: "NULL"}];
    }
    
    let query = "INSERT INTO employee (first_name, last_name, title_id, manager_id)" 
    query += "VALUE ('"+answers.firstName.trim()+"','"+answers.lastName.trim()+"',"+titleId[0].id+","+managerId[0].id+")";
    
    await queryPromise(query);
    
    viewEmployees();

  } catch (error) {
    console.log(error);
  }
}

async function getDepartmentNames() {
  try {
    departmentArray = await queryPromise("SELECT * FROM department");
  } catch (error) {
    console.log(error);
  }
}

async function getRoleNames() {
  try {
    titleArray = await queryPromise("SELECT * FROM role");
  } catch (error) {
    console.log(error);
  }
}

async function getEmployeeNames() {
  try {
    employeeArray = await queryPromise("SELECT * FROM employee");
  } catch (error) {
    console.log(error);
  }
}
