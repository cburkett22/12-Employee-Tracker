DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;
USE employeeDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee_role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (department_name)
VALUES ("Sales"), ("Engineering"), ("Legal"), ("Finance"), ("Human Resources");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Sales Lead", 75000, 1), ("Sales Representative", 50000, 1), ("Engineering Lead", 120000, 2), ("Software Developer", 100000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Corey", "Burkett", 1, 11), ("Buzz", "Lightyear", 2, 22);

SELECT * FROM department;
SELECT * FROM employee_role;
SELECT * FROM employee;