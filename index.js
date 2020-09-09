const mysql = require("mysql");
const inquirer = require("inquirer");

// Classes
const Employee = require("./assets/lib/Employee");
const Role = require("./assets/lib/Role");
const Department = require("./assets/lib/Department");
const { query } = require("express");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "CabMcb2017", // ENTER YOUR MYSQL PASSWORD HERE
    database: "employee_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Did you enter your MySQL password correctly?");
    start();
});

var managers;
var allEmployees;
var allRoles;
var departments;

function getManagers() {
    managers = [];
    var query = "SELECT manager_name FROM employee;";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            if (managers.includes(res[i].manager_name) === false) {
                managers.push(res[i].manager_name);
            }
        }
    });
}

function getAllEmployees() {
    allEmployees = [];
    var query = "SELECT first_name, last_name FROM employee;"

    connection.query(query, function(err, res) {
        if (err) {
            throw err;
        }
        for (i = 0; i < res.length; i++) {
            allEmployees.push(res[i].first_name + " " + res[i].last_name);
        }
    });
}

function getRoles() {
    allRoles = [];
    var query = "SELECT id, title, salary, department_id FROM employee_role";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            allRoles.push(res[i].title);
        }
    });
}

function getDepts() {
    departments = [];
    var query = "SELECT id, department_name FROM department";
    connection.query(query, function(err, res) {
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].id + ". " + res[i].department_name);
        }
    });
}

console.log(`
=====================================================================================
|                                                                                   |
|  W       W   E E E E   L         C C C C   O O O O   M M   M M   E E E E   !! !!  |
|  W       W   E         L         C         O     O   M  M M  M   E         !! !!  |
|  W   W   W   E E E E   L         C         O     O   M   M   M   E E E E   !! !!  |
|  W  W W  W   E         L         C         O     O   M       M   E                |
|  W W   W W   E E E E   L L L L   C C C C   O O O O   M       M   E E E E   !! !!  |
|                                                                                   |
=====================================================================================
`);

function start() {
    getManagers();
    getAllEmployees();
    getRoles();
    getDepts();

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
    var query = "SELECT employee_role.id, employee_role.title, employee_role.salary, employee_role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
    query += "FROM employee_role INNER JOIN employee ON (employee_role.id = employee.role_id) ";
    query += "ORDER BY employee_role.id";

    connection.query(query, function(err, res) {
        if (err) throw err;

        var employees = [];
        
        for (var i = 0; i < res.length; i++) {
          const employee = new Employee(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].manager_name);
          employees.push(employee);
        }
        console.table(employees);
        start();
    });
}

function viewAllEmployeesByDepartment() {
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
            if (err) throw err;

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
    console.log("Managers: " + managers);

    inquirer.prompt(
        {
            type: "input",
            name: "managerName",
            message: "Enter managers name:"
        }
    ).then(function(answer) {
        var query = "SELECT employee_role.id, employee_role.title, employee_role.salary, employee_role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_name ";
        query += "FROM employee_role INNER JOIN employee ON (employee_role.id = employee.role_id)";
    
        connection.query(query, function(err, res) {
            if (err) throw err;

            var employees = [];

            for (var i = 0; i < res.length; i++) {
                if (res[i].manager_name == answer.managerName) {
                    const employee = new Employee(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].manager_name);
                    employees.push(employee);
                }
            }
            console.table(employees);
            start();
        });
    });
}

function addEmployee() {
    console.log("Roles: ", allRoles);

    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        },
        {
            type: "input",
            name: "role",
            message: "What is the employees role ID? (Count down the list for the ID number)"
        },
        {
            type: "input",
            name: "manager",
            message: "Who is the employees manager?"
        }
    ]).then(function(response) {
        if (response.firstName === "" || response.lastName === "" || response.role === "" || response.manager === "") {
            console.log("Please answer all of the questions...");
            addEmployee();
        } else {
            var query = `INSERT INTO employee (first_name, last_name, role_id, manager_name)
            VALUES ("${response.firstName}", "${response.lastName}", ${response.role}, "${response.manager}")`;

            connection.query(query, function(err, res) {
                if (err) throw err;
                
                console.log("Employee added!");
                start();
            });
        }
    });

}

function removeEmployee() {
    console.log("Employees: ", allEmployees);
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        }
    ]).then(function(answer) {
        var query = `DELETE FROM employee WHERE first_name = "${answer.firstName}" AND last_name = "${answer.lastName}";`;

        connection.query(query, function(err, res) {
            if (err) throw err;

            console.log("Employee removed");
            start();
        });
    });
}

function updateEmployeeRole() {

}

function updateEmployeeManager() {

}

function viewAllRoles() {
    var query = "SELECT id, title, salary, department_id FROM employee_role";
    connection.query(query, function(err, res) {
        var roles = [];
        for (i = 0; i < res.length; i++) {
            const role = new Role(res[i].id, res[i].title, res[i].salary, res[i].department_id);
            roles.push(role);
        }
        console.table(roles);
        start();
    });
}

function addRole() {
    console.log("Departments: ", departments);
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
            message: "Input department ID: (Count down the list for the ID number)"
        }
    ]).then(function(answer) {
        if (answer.title === "" || answer.salary === "" || answer.department === "") {
            console.log("Please fill out all inputs.");
            start();
        } else {
            var query = `INSERT INTO employee_role (title, salary, department_id)
            VALUES ("${answer.title}", ${answer.salary}, ${answer.department});`;
            
            connection.query(query, function(err, res) {
                if (err) throw err;
                console.log("Role added");
                start();
            });
        }
    });
}

function removeRole() {
    console.log("Roles: ", allRoles);

    inquirer.prompt(
        {
            type: "input",
            name: "role",
            message: "Which role would you like to remove?\n(WARNING: Removing a role will also remove the employee/ employee data attached to that role)"
        }
    ).then(function(answer) {
        var query = `DELETE FROM employee_role WHERE title = '${answer.role}';`;

        connection.query(query, function(err, res) {
            if (err) throw err;
            console.log(`Role removed`);
            start();
        });
    });
}