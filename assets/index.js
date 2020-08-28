const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Classes
const Employee = require("./lib/Employee");
const Role = require("./lib/Role");
const Department = require("./lib/Department");

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
    var query = "SELECT employee_role.id, employee_role.title, employee_role.salary, employee_role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
    query += "FROM employee_role INNER JOIN employee ON (employee_role.id = employee.role_id) ";
    query += "ORDER BY employee_role.id";

    connection.query(query, function(err, res) {
        if (err) {
            throw err;
        }
        var employees = [];
        
        for (var i = 0; i < res.length; i++) {
          const employee = new Employee(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].manager_name);
          employees.push(employee);
        }
        console.table(employees);
        start();
    });
}

function viewAllEmployeesByDepartment() { // NOT DONE ADD CONSOLE.TABLE
    console.log(`
    Departments:
    1. Sales
    2. Engineering
    3. Legal
    4. Finance
    5. Human Resources
    `);
    inquirer.prompt(
        {
            type: "input",
            name: "department",
            message: "Enter department ID #:"
        }
    ).then(function(answer) {
        var query = "SELECT department.id, department.department_name, employee_role.id, employee_role.title, employee_role.department_id, employee_role.salary, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
        query += "FROM department INNER JOIN employee_role ON (department.id = employee_role.department_id) ";
        query += "INNER JOIN employee ON (employee_role.id = employee.role_id) ";
        query += "WHERE (department.id = ? AND employee_role.department_id = ?) ";
        query += "ORDER BY department.id";
        
        connection.query(query, [answer.department, answer.department], function(err, res) {
            if (err) {
                throw err;
            }
            var employees = [];

            for (var i = 0; i < res.length; i++) {
              const employee = new Employee(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].manager_name);
              employees.push(employee);
            }
            console.table(employees);
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
            type: "input",
            message: "What is the employees role?",
        },
        {
            name: "department",
            type: "list",
            message: "What is the employees department?",
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
function viewAllRoles() { // NOT DONE ADD CONSOLE.TABLE
    var query = "SELECT title, department_id FROM employee_role";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            console.log(res[i].title, res[i].department_id);
        }
        start();
    });

}

function addRole() { // NOT DONE ADD CONSOLE.TABLE
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