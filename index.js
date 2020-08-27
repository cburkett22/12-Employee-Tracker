const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "CabMcb2017",
    database: "employeeDB"
});

connection.connect(function(err) {
    if (err) {
        throw err;
    }
    start();
});

function start() {
    console.log("Welcome to the Employee Manager Application");

    inquirer.prompt({
      name: "choices",
      type: "list",
      message: "What would you like to do?",
      choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "Add Role",
          "Remove Role",
          "EXIT"
        ]
    }).then(function(answer) {
        console.log("You Chose:", answer.choices);

        if (answer.choices === "View All Employees") {
            viewAllEmployees();
        } else if (answer.choices === "View All Employees By Department") {
            viewAllEmployeesByDepartment();
        }else if (answer.choices === "View All Employees By Manager") {
            viewAllEmployeesByManager();
        }else if (answer.choices === "Add Employee") {
            addEmployee();
        }else if (answer.choices === "Remove Employee") {
            removeEmployee();
        }else if (answer.choices === "Update Employee Role") {
            updateEmployeeRole();
        }else if (answer.choices === "Update Employee Manager") {
            updateEmployeeManager();
        }else if (answer.choices === "View All Roles") {
            viewAllRoles();
        }else if (answer.choices === "Add Role") {
            addRole();
        }else if (answer.choices === "Remove Role") {
            removeRole();
        }else {
            connection.end();
        }
    });
}

function viewAllEmployees() {
    // print current employee table
}

function viewAllEmployeesByDepartment() {
    inquirer.prompt(
        {
            name: "department",
            type: "list",
            message: "Choose a department:",
            choices: [
                "Sales",
                "Engineering",
                "Legal",
                "Finance",
                "Human Resources",
                "GO BACK"
            ]
        }
    ).then(function(answer) {
        console.log("You Chose:", answer.department);

        if (answer.department === "Sales") {
            // print sales department list
        }else if (answer.department === "Engineering") {
            // print engineering department list
        }else if (answer.department === "Legal") {
            // print legal department list
        }else if (answer.department === "Finance") {
            // print finance department list
        }else if (answer.department === "Human Resources") {
            // print HR department list
        }else {
            start();
        }
    });
}

function viewAllEmployeesByManager() {

}

function addEmployee() {
    inquirer.prompt(
        {
            name: "firstName",
            type: "input",
            message: "What is the employees first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employees last name?",
        },
        {
            name: "role",
            type: "list",
            message: "What is the employees role?",
            choices: [
                "Sales",
                "Engineering",
                "Legal",
                "Finance",
                "Human Resources"
            ]
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employees manager?",
            choices: [
                // list managers names here
            ]
        }
    ).then(function(answer) {

    });
}

function removeEmployee() {

}

function updateEmployeeRole() {

}

function updateEmployeeManager() {

}
function viewAllRoles() {

}

function addRole() {

}

function removeRole() {

}