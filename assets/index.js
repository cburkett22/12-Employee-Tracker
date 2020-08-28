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

function viewAllEmployees() { // DONE
    var query = "SELECT first_name, last_name FROM employee";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            console.log(res[i].first_name, res[i].last_name, res[i].role_id);
        }
        start();
    });

}

function viewAllEmployeesByDepartment() { // DONE
    inquirer.prompt(
        {
            type: "input",
            name: "department",
            message: "Enter department name:"
        }
    ).then(function(answer) {
        var query = `SELECT id, department_name FROM department`;
        var deptID;
        connection.query(query, function(err, res) {
            for (i = 0; i < res.length; i++) {
                if (res[i].department_name == answer.department) {
                    console.log(res[i].id, res[i].department_name);
                    deptID = res[i].id;
                }
            }
        });

        var query2 = `SELECT id, title, department_id FROM employee_role`;
        var roleID = [];
        connection.query(query2, function(err, res) {
            for (i = 0; i < res.length; i++) {
                if (res[i].department_id == deptID) {
                    console.log(res[i].id, res[i].title);
                    roleID.push(res[i].id);
                }
            }
        });

        var query3 = `SELECT id, first_name, last_name, role_id FROM employee`;
        connection.query(query3, function(err, res) {
            for (i = 0; i < res.length; i++) {
                if (roleID.includes(res[i].role_id) == true) {
                    console.log(`\nfinal results`, res[i].id, res[i].first_name, res[i].last_name);
                }
            }
            start();
        });
    });

}

function viewAllEmployeesByManager() {

}

function addEmployee() { // ONLY ADDS/PROMPTS FIRST NAME
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
                "Sales (ID: 1)",
                "Engineering (ID: 2)",
                "Legal (ID: 3)",
                "Finance (ID: 4)",
                "Human Resources (ID: 5)"
            ]
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employees manager?",
            choices: [
                "John Wayne (ID: 11)",
                "Denzel Washington (ID: 22)"
            ]
        }
    ).then(function(answer) {
        var query = `INSERT INTO employee (first_name, last_name, employee_role, department_id, manager_name)\n
        VALUES ("${answer.firstName}", "${answer.lastName}", "${answer.role}", 4567, "${answer.manager}")`;
        
        connection.query(query, function(err, res) {
            console.log("Employee added!"); //something to view object);
            start();
        });
    });

}

function removeEmployee() {

}

function updateEmployeeRole() {

}

function updateEmployeeManager() {

}
function viewAllRoles() { // DONE
    var query = "SELECT title, department_id FROM employee_role";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            console.log(res[i].title, res[i].department_id);
        }
        start();
    });

}

function addRole() { // DONE
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Input role title:"
        },
        {
            type: "input",
            name: "salary",
            message: "Input role salary:"
        },
        {
            type: "input",
            name: "department",
            message: "Input department ID:"
        }
    ]).then(function(answer) {
        var query = `INSERT INTO employee_role (title, salary, department_id)
        VALUES ("${answer.title}", ${answer.salary}, ${answer.department});`;
        connection.query(query, function(err, res) {
            console.log("Role added!"); //something to view role;
            start();
        });
    });
}

function removeRole() {

}