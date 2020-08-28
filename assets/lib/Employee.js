class Employee {
    constructor(id, firstName, lastName, role, salary, manager) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.role = role;
      this.salary = salary;
      this.manager = manager;
    }
}

module.exports = Employee;