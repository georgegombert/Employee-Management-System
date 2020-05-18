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
        "View Employees by Mangager",
        "Update Employee Role",       
        "Update Employee Manager",       
        "Delete Employee",      
        "Delete Role",      
        "Delete Department",      
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
        case "View Employees by Mangager":
          viewByManager();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "Exit":
          connection.end(err => console.log("Goodbye"));
          break;
      }
    });
}

function viewDepartments() {
  connection.query("SELECT department_name FROM department", (err, res) => {
    console.table(res);
    returnHome();
  });
}

function viewRoles() {
  let query = "SELECT role.title, role.salary, department.department_name";
  query += " FROM role, department";
  query += " WHERE department.id = department_id";
  
  connection.query(query, (err, res) => {
    console.table(res);
    returnHome();
  });
}

function viewEmployees() {
  let query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, employee.manager_id"
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
      connection.query("INSERT INTO department (department_name) VALUE ('"+answer.departmentName.trim()+"')" ,err => {
        if (err) throw err;
        viewDepartments();
    })
  });
}

async function addRole() {
  await getDepartmentNames();
  const answer = await inquirer
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
      },
      {
        name: "department",
        type: "list",
        message: "What department does this role belong to?",
        choices: departmentArray.map(department => department.department_name)
      }
    ])
    const departmentId = departmentArray.filter(department => department.department_name === answer.department);
    
    let query = "INSERT INTO role (title, salary, department_id)" 
    query += " VALUE ('"+answer.roleName.trim()+"','"+answer.roleSalary+"',"+departmentId[0].id+")"
    
    await queryPromise(query);
    
    viewRoles();
  
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
          message: "Select employee manager (select none for no manager)",
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

async function updateEmployeeRole() {
  try {
    await getEmployeeNames();
    await getRoleNames();
    const answer = await inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select employee you would like to update:",
          choices: employeeArray.map(name => ""+name.first_name+" "+name.last_name+"")
        },
        {
          name: "newTitle",
          type: "list",
          message: "Select new title for employee:",
          choices: titleArray.map(role => role.title)
        }
      ])
    const employeeAnswer = answer.employee.split(" ");
    const employeeId = employeeArray.filter(employee => employee.first_name === employeeAnswer[0] && employee.last_name === employeeAnswer[1]);
    
    const titleId = titleArray.filter(role => role.title === answer.newTitle);
    let query = "UPDATE employee SET title_id= "+titleId[0].id+" WHERE employee.id = "+employeeId[0].id+";";
    await queryPromise(query);
    viewEmployees();
  } catch (error) {
    throw error;
  }
  
}

async function updateEmployeeManager() {
  try {
    await getEmployeeNames();
    const employeeChoices = employeeArray.map(employee => employee.first_name +" "+ employee.last_name);
    employeeChoices.push("None");
    const answer = await inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select employee you would like to update:",
          choices: employeeArray.map(name => ""+name.first_name+" "+name.last_name+"")
        },
        {
          name: "newManager",
          type: "list",
          message: "Select new manager for employee:",
          choices: employeeChoices
        }
      ])
    const employeeAnswer = answer.employee.split(" ");
    const employeeId = employeeArray.filter(employee => employee.first_name === employeeAnswer[0] && employee.last_name === employeeAnswer[1]);
    
    let managerId = employeeArray.filter(manager => manager.first_name +" "+ manager.last_name === answer.newManager);
    if(answer.newManager === "None"){
      managerId =[{id: "NULL"}];
    }

    let query = "UPDATE employee SET manager_id= "+managerId[0].id+" WHERE employee.id = "+employeeId[0].id+";";
    await queryPromise(query);
    viewEmployees();
  } catch (error) {
    throw error;
  }
}

async function viewByManager() {
  try {
    await getEmployeeNames();
    const employeeChoices = employeeArray.map(employee => employee.first_name +" "+ employee.last_name);
    employeeChoices.push("None");
    const answer = await inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select Manager to view their team:",
          choices: employeeArray.map(name => ""+name.first_name+" "+name.last_name+"")
        }
      ])
    const employeeAnswer = answer.employee.split(" ");
    const employeeId = employeeArray.filter(employee => employee.first_name === employeeAnswer[0] && employee.last_name === employeeAnswer[1]);
    

    let query = "SELECT employee.first_name, employee.last_name FROM employee WHERE employee.manager_id = "+employeeId[0].id+";";
    const res = await queryPromise(query);

    if (res.length === 0){
      console.log(`\n${answer.employee} does not manage anyone`);
    } else{
      console.log(`\nThe employees that are on ${answer.employee}'s team are:`);
      console.table(res.map(name => `${name.first_name} ${name.last_name}`));
    }
    returnHome();
  } catch (error) {
    throw error
  }
}

async function deleteEmployee() {
  try {
    await getEmployeeNames();
    const answer = await inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select employee you would like to remove:",
          choices: employeeArray.map(name => ""+name.first_name+" "+name.last_name+"")
        },
      ])
    const employeeAnswer = answer.employee.split(" ");
    const employeeId = employeeArray.filter(employee => employee.first_name === employeeAnswer[0] && employee.last_name === employeeAnswer[1]);
    
    let query = "DELETE FROM employee WHERE employee.id = "+employeeId[0].id+";";
    await queryPromise(query);
    viewEmployees();
  } catch (error) {
    throw error;
  }
}

async function deleteRole() {
  try {
    await getRoleNames();
    const answer = await inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Select role you would like to remove:",
          choices: titleArray.map(role => role.title)
        },
      ])
    const titleId = titleArray.filter(role => role.title === answer.role);
    
    let query = "DELETE FROM role WHERE role.id = "+titleId[0].id+";";
    await queryPromise(query);
    viewEmployees();
  } catch (error) {
    throw error;
  }
}

async function deleteDepartment() {
  try {
    await getDepartmentNames();
    const answer = await inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Select department you would like to remove:",
          choices: departmentArray.map(department => department.department_name)
        }
      ])
    const departmentId = departmentArray.filter(department => department.department_name === answer.department);
    
    let query = "DELETE FROM department WHERE department.id = "+departmentId[0].id+";";
    
    await queryPromise(query);
    
    viewEmployees();
  
  } catch (error) {
    throw error;
  }
}