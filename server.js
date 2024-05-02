const inquirer = require("inquirer");
const mysql = require("./config/connections");

const addToDepartment = [{
  type: "input",
  name: "department_name",
  message: "What is the name of the new department?"
}]

const addEmployeeQuestions= (arr) => [
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
    choices: arr
  },
,
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
  const employee = await mysql.promise().query("SELECT * FROM employee");
  const employeeArr = employee[0].map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }) )
  inquirer
  .prompt(addEmployeeQuestions(employeeArr))
  .then(({data})=>{
    console.log(data);
     mysql.promise().query(`INSERT INTO employee(first_name, last_name, manager_id) VALUE ('${first_name}', '${last_name}', ${manager_id});`)
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

const graphic = () => {
  console.log(" _____                 _                       \r\n| ____|_ __ ___  _ __ | | ___  _   _  ___  ___ \r\n|  _| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\\r\n| |___| | | | | | |_) | | (_) | |_| |  __\/  __\/\r\n|_____|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|\r\n                |_|            |___\/           \r\n __  __                                   \r\n|  \\\/  | __ _ _ __   __ _  __ _  ___ _ __ \r\n| |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__|\r\n| |  | | (_| | | | | (_| | (_| |  __\/ |   \r\n|_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   \r\n                          |___\/           \r\n")
}

const menuList = () => {
  graphic();
  inquirer
   .prompt(mainMenu)
   .then((answers) => {
    options(answers)
   })
}


menuList()