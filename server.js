const inquirer = require("inquirer");
const mysql = require("./config/connections");

const addToDepartment = [{
  type: "input",
  name: "department_name",
  message: "What is the name of the new department?"
}]

const addEmployeeQuestions= (roleArr, employeeArr) => [
  {
  type: "input",
  name: "first_name",
  message: "What is the employee's first name?"
  },
  {
    type: "input",
    name: "last_name",
    message: "What is the employee's last name?"
  },
  {
    type: "list",
    name: "manager_id",
    message: "What is the employee's manager?",
    choices: employeeArr
  },
  {
    type: "list",
    name: "role_id",
    message: "What is the employee's role?",
    choices: roleArr
  }
]

const addRoleQuestions = (arr) => [
  {
    type: "input",
    name: "title",
    message: "What is the title of the new role?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary of the new role?"
  },
  {
    type: "list",
    name: "department_id",
    message: "Which department does this role belong to?",
    choices: arr
  }
]

const updateEmployeeRoleQuestions = (roleArr, employeeArr) => [
  {
    type: "list",
    name: "employee_id",
    message: "Which employee would you like to update?",
    choices: roleArr
  },
  {
    type: "list",
    name: "role_id",
    message: "What is the employee's new role?",
    choices: employeeArr
  },
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure you want to update this employee's role?"
  },
]

const figlet = require("figlet");
figlet.text("Employee Tracker", function (err, data) {
  console.log(data);
  menuList(); // Prompt the user for the main menu after displaying the ASCII art
});

const mainMenu = [
  {
    type: "list",
    name: "main_menu",
    message: "What would you like to do?",
    choices: [
      "Add a department",
      "Add an employee",
      "Add a role",
      "View all departments",
      "View all roles",
      "View all employees",
      "Update an employee role",
      "Exit"
    ]
  }
] 

const viewDepartments = () => {
  mysql.promise().query("SELECT * FROM department;")
  .then(res=>{console.table(res[0])
  menuList();
  })
}
const addDepartment = () =>{
  inquirer
      .prompt(addToDepartment)
      .then(({department_name})=>{
          mysql.promise().query(`INSERT INTO department(department_name) VALUE ('${department_name}');`)
          .then(res=>{
              console.log(`Added ${department_name} to database`);
              menuList();
          })
      })
}

const viewAllRoles = () => {
  mysql.promise().query("SELECT * FROM role;")
  .then(res=>{console.table(res[0])
  menuList();
  })
}

const viewAllEmployees = () => {
  mysql.promise().query("SELECT * FROM employee;")
  .then(res=>{console.table(res[0])
  menuList();
  })
}

const addEmployee = async() => {
  const role = await mysql.promise().query("SELECT * FROM role;");
  const roleArr = role[0].map((role) => ({
    name: role.title,
    value: role.id,
  }) )
  const employee = await mysql.promise().query("SELECT * FROM employee");
  const employeeArr = employee[0].map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }) )
  inquirer
  .prompt(addEmployeeQuestions(roleArr, employeeArr))
  .then(({first_name, last_name, role_id, manager_id})=>{
    console.log(manager_id);
     mysql.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUE ('${first_name}', '${last_name}', ${role_id}, ${manager_id});`)
     .then(res=>{
         console.log(`Added ${first_name} ${last_name} to database`);
         menuList();
     })
 })
}

const addRole = async() => {
  const departments = await mysql.promise().query("SELECT * FROM department;");
  const deptArr = departments[0].map((department) => ({
    name: department.department_name,
    value: department.id,
  }) )
  inquirer
     .prompt(addRoleQuestions(deptArr))
     .then(({title, salary, department_id})=>{
        mysql.promise().query(`INSERT INTO role(title, salary, department_id) VALUE ('${title}', ${salary}, ${department_id});`)
        .then(res=>{
            console.log(`Added ${title} to database`);
            menuList();
        })
    })
}

const updateEmployeeRole = async() => {
  const employees = await mysql.promise().query("SELECT * FROM employee;");
  const roles = await mysql.promise().query("SELECT * FROM role;");
  const employeeArr = employees[0].map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  const roleArr = roles[0].map((role) => ({
    name: role.title,
    value: role.id,
  }));
  inquirer
    .prompt(updateEmployeeRoleQuestions(employeeArr, roleArr))
    .then(({ employee_id, role_id, confirm }) => {
      if (!confirm) {
        console.log("Update cancelled.");
        menuList();
        return;
      }

      mysql.promise().query(
        `UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id};`
      )
      .then((res) => {
        console.log(`Employee's role updated successfully.`);
        menuList();
      })
      .catch((err) => {
        console.error(err);
      });
    });
}

const options = (response) => {
  switch (response.main_menu) {
    case 'View all departments':
    viewDepartments();
    break;
    case 'Add a department':
    addDepartment();
    break;
    case 'View all roles':
      viewAllRoles();
      break;
    case 'Add a role':
      addRole();
      break;
    case 'View all employees':
      viewAllEmployees();
      break;
    case 'Add an employee':
      addEmployee();
      break;
    case 'Update an employee role':
      updateEmployeeRole();
      break;
    case 'Exit':
    mysql.end();
    break;
  }
}

const menuList = () => {
  inquirer
   .prompt(mainMenu)
   .then((answers) => {
    options(answers)
   })
}
