const inquirer = require("inquirer");
const mysql = require("./config/connections");

const addDepartment = [{
  type: "input",
  name: "department_name",
  message: "What is the name of the new department?"
}]

const addEmployee= [
  {
  type: "input",
  name: "first_name",
  message: "What is the employee's first name?"
  },
  {
    type: "input",
    name: "last_name",
    message: "What is the employee's last name?"
  }
]

const addRole = [
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
]

const mainMenu = [
  {
    type: "list",
    name: "main_menu",
    message: "What would you like to do?",
    choices: [
      "Add a department",
      // "Add an employee",
      // "Add a role",
      "View all departments",
      // "View all roles",
      // "View all employees",
      // "Update an employee role",
      "Exit"
    ]
  }
] 
const options = (response) => {
  switch (response.main_menu) {
    case 'View all departments':
    viewDepartments();
    break;
    case 'Add a department':
    addDepartment();
    break;
    case 'Exit':
    mysql.end();
    break;
  }
}

const menuList = () => {
  inquirer
   .prompt(mainMenu)
   .then((answer) => {
    options(answers)
   })
}