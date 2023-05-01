const {prompt} = require('inquirer');
const logo = require('asciiart-logo');
const db = require('./db');
const connection = require('./db/connections')

require('console.table');

init();

function init(){
    const logoText = logo({name: 'Employee Manager'}).render();

    console.log(logoText);

    LoadMainPrompts();
}

function LoadMainPrompts(){
    prompt([
        {
            type: 'list',
            name: 'Userchoice',
            message: 'What would you like to do?',
            choices:[
                {
                    name: '1)',
                    value:'View All Employees',
                },
                {
                    name:'2)',
                    value:'View Employees by Department'
                },
                {
                    name:'3)',
                    value: 'Add Employee'
                },
                {
                    name: '4)',
                    value:'Remove Employee'
                },
                {
                    name: '5)',
                    value: 'Update Employee Role'
                },
                {
                    name: '6)' ,
                    value:'Add Role'
                },
                {
                    name: '7)',
                    value:'Add Department'
                },
                {
                    name: '8)',
                    value:'Exit'
                },
            ]
        },
    ]).then((res)=>{
        console.log(res.userChoice);
        switch(res.userChoice){
          case 'View All Employees':
            viewAllEmployees(); //?
            break;
          case 'View Employees By Department':
            viewEmployeesByDepartment(); // !
            break;
          case 'Add Employee':
            addEmployee(); //* 
            break;
          case 'Remove Employee':
            removeEmployee(); // TODO
            break;
          case 'Update Employee Role':
            updateEmployeeRole(); // ?
            break;
          case 'Add Role':
            addRole(); // ! 
            break;
          case 'Add Department':
            addDepartment(); // *
            break;
          case 'Exit':
            connection.end();
            break;
          }
          
        }).catch((err)=>{
      if(err)throw err;
      });
}

////////////////////?view all
function viewAllEmployees(){
    let query = 
    `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    LEFT JOIN employee manager
        ON manager.id = employee.manager_id`
  
    connection.query(query, (err, res)=>{
      if (err) throw err;
      console.table(res);
      firstPrompt();
    });
}

//////////////////// ! view department
function viewEmployeesByDepartment(){
    let query =
    `SELECT 
        department.id, 
        department.name, 
        role.salary
    FROM employee
    LEFT JOIN role 
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    GROUP BY department.id, department.name, role.salary`;
  
  connection.query(query,(err, res)=>{
      if (err) throw err;
      const deptChoices = res.map((choices) => ({
          value: choices.id, name: choices.name
      }));
    console.table(res);
    getDept(deptChoices);
  });
}

//////////////////// * add employee
function addEmployee(){
    let query = 
    `SELECT 
        role.id, 
        role.title, 
        role.salary 
    FROM role`

 connection.query(query,(err, res)=>{
    if(err)throw err;
    const role = res.map(({ id, title, salary }) => ({
      value: id, 
      title: `${title}`, 
      salary: `${salary}`
    }));

    console.table(res);
    employeeRoles(role);
  });
}

//////////////////// TODO remove employee
function removeEmployee(){
    let query =
  `SELECT
      employee.id, 
      employee.first_name, 
      employee.last_name
  FROM employee`

  connection.query(query,(err, res)=>{
    if(err)throw err;
    const employee = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${id} ${first_name} ${last_name}`
    }));
    console.table(res);
    getDelete(employee);
  });
}
function getDelete(employee){  
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Employee To Be Deleted: ",
          choices: employee
        }
      ]).then((res)=>{
        let query = `DELETE FROM employee WHERE ?`;
        connection.query(query, { id: res.employee },(err, res)=>{
          if(err) throw err;
          firstPrompt();
        });
      });
  }

////////////////////? update employee
function updateEmployeeRole(){
    let query = `SELECT 
                    employee.id,
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.name, 
                    role.salary, 
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employee
                JOIN role
                    ON employee.role_id = role.id
                JOIN department
                    ON department.id = role.department_id
                JOIN employee manager
                    ON manager.id = employee.manager_id`
  
    connection.query(query,(err, res)=>{
      if(err)throw err;
      const employee = res.map(({ id, first_name, last_name }) => ({
        value: id,
         name: `${first_name} ${last_name}`      
      }));
      console.table(res);
      updateRole(employee);
    });
}
function updateRole(employee){
    let query = 
    `SELECT 
      role.id, 
      role.title, 
      role.salary 
    FROM role`
  
    connection.query(query,(err, res)=>{
      if(err)throw err;
      let roleChoices = res.map(({ id, title, salary }) => ({
        value: id, 
        title: `${title}`, 
        salary: `${salary}`      
      }));
      console.table(res);
      getUpdatedRole(employee, roleChoices);
    });
  }
    
  function getUpdatedRole(employee, roleChoices) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: `Employee who's role will be Updated: `,
          choices: employee
        },
        {
          type: "list",
          name: "role",
          message: "Select New Role: ",
          choices: roleChoices
        },
  
      ]).then((res)=>{
        let query = `UPDATE employee SET role_id = ? WHERE id = ?`
        connections.query(query,[ res.role, res.employee],(err, res)=>{
            if(err)throw err;
            firstPrompt();
          });
      });
  }

//////////////////// ! add role
function addRole(){
    var query = 
    `SELECT 
      department.id, 
      department.name, 
      role.salary
    FROM employee
    JOIN role
      ON employee.role_id = role.id
    JOIN department
      ON department.id = role.department_id
    GROUP BY department.id, department.name`
  
    connection.query(query,(err, res)=>{
      if(err)throw err;
      const department = res.map(({ id, name }) => ({
        value: id,
        name: `${id} ${name}`
      }));
      console.table(res);
      addToRole(department);
    });
}
function addToRole(department){
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Role title: "
        },
        {
          type: "input",
          name: "salary",
          message: "Role Salary: "
        },
        {
          type: "list",
          name: "department",
          message: "Department: ",
          choices: department
        },
      ]).then((res)=>{
        let query = `INSERT INTO role SET ?`;
  
        connection.query(query, {
            title: res.title,
            salary: res.salary,
            department_id: res.department
        },(err, res)=>{
            if(err) throw err;
            firstPrompt();
        });
    });
}

//////////////////// * add department
function addDepartment()
inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department Name: "
      }
    ]).then((res)=>{
    let query = `INSERT INTO department SET ?`;
    connection.query(query, {name: res.name},(err, res)=>{
      if(err) throw err;
      //console.log(res);
      firstPrompt();
    });
  });