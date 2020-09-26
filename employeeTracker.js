const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
var Table = require('cli-table');

let emptyArrDep_id_name = [];
let emptyArrRol_id_name = [];
let emptyArrEmp_id_name = ['None'];
let emptyArrEmp_id_name2 = [];

let viewAllEmployee = [];

var connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: '',
  database: 'employee_rackerDB',
});

connection.connect(function (err) {
  if (err) throw err;
  whatToDO();
});
function whatToDO() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees By Department',
        'View All Employees By Manager',
        'Update Employee Role',
        'Add Employees',
        'Add Department',
        'Add Roles',
        'exit',
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case 'View All Employees':
          viewEmployee();
          break;
        case 'View All Employees By Department':
          viewEmployeeByDepart();
          break;
        case 'View All Employees By Manager':
          viewEmployeeByManager();
          break;
        case 'Update Employee Role':
          emptyArrRol_id_name = [];
          emptyArrEmp_id_name = ['None'];
          updateEmployeeRole();
          break;
        case 'Add Employees':
          emptyArrRol_id_name = [];
          emptyArrEmp_id_name = ['None'];
          addEmployee();
          break;

        case 'Add Department':
          addDepartment();
          break;

        case 'Add Roles':
          emptyArrDep_id_name = [];
          addRoles();
          break;

        case 'exit':
          connection.end();
          break;
      }
    });
}

function viewEmployee() {
  var query =
    'SELECT * FROM employee Inner Join employeeRole on employee.role_id = employeeRole.id Inner Join department on  department.id= employeeRole.department_id ORDER BY employee.employee_id;';
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      // instantiate
      // console.log(
      //   `${${res[i].employee_id}}  ${res[i].first_name}   ${res[i].last_name}   ${res[i].title}  ${res[i].department_name}  ${res[i].salary} `
      // );
      viewAllEmployee.push([
        res[i].employee_id,
        res[i].first_name,
        res[i].last_name,
      ]);
    }

    console.log(viewAllEmployee);

    var table = new Table();

    table.push(['Id', 'First Name', 'Last Name'], viewAllEmployee);
    table.push(
      { 'Some key': 'Some value' },
      { 'Another key': 'Another value' }
    );

    console.log(table.toString());

    whatToDO();
  });
}

function viewEmployeeByDepart() {
  var query =
    'SELECT * FROM employee Inner Join employeeRole on employee.role_id = employeeRole.id Inner Join department on  department.id= employeeRole.department_id ORDER BY employee.employee_id;';
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        `${res[i].employee_id}  ${res[i].first_name}   ${res[i].last_name}   ${res[i].department_name}`
      );
    }
    whatToDO();
  });
}

function viewEmployeeByManager() {
  var query =
    'SELECT * FROM employee Inner Join employeeRole on employee.role_id = employeeRole.id Inner Join department on  department.id= employeeRole.department_id ORDER BY employee.employee_id;';
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        `${res[i].employee_id}  ${res[i].first_name}   ${res[i].last_name}   ${res[i].title}`
      );
    }
    whatToDO();
  });
}

function updateEmployeeRole() {
  var query2 = 'SELECT * FROM employeeRole';
  connection.query(query2, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      emptyArrRol_id_name.push(`${res[i].id}:${res[i].title}`);
    }
  });

  var query4 = 'SELECT * FROM employee';
  connection.query(query4, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      emptyArrEmp_id_name2.push(
        `${res[i].employee_id}:${res[i].first_name} ${res[i].last_name}`
      );
    }

    console.log(emptyArrEmp_id_name2);

    inquirer
      .prompt([
        {
          name: 'employee',
          type: 'list',
          message: 'Which employe you are trying to updated ?',
          choices: emptyArrEmp_id_name2,
        },
        {
          name: 'employeeRole',
          type: 'list',
          message: 'Which employe you are trying to updated ?',
          choices: emptyArrRol_id_name,
        },
      ])
      .then(function (answer) {
        var query = `UPDATE employee  SET role_id = ${answer.employeeRole.charAt(
          0
        )} WHERE employee_id = ${answer.employee.charAt(0)}`;

        connection.query(query, answer, function (err, res) {
          if (err) throw err;
          console.log('Number of records inserted: ' + res.affectedRows);
          whatToDO();
        });
      });
  });
}

function addEmployee() {
  var query2 = 'SELECT * FROM employeeRole';
  connection.query(query2, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].department_name);
      emptyArrRol_id_name.push(`${res[i].id}:${res[i].title}`);
    }
  });

  var query3 = 'SELECT * FROM employee';
  connection.query(query3, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].department_name);
      emptyArrEmp_id_name.push(
        `${res[i].employee_id}:${res[i].first_name} ${res[i].last_name}`
      );
    }
  });

  inquirer
    .prompt([
      {
        name: 'fname',
        type: 'input',
        message: "What is the employee's first name?",
      },
      {
        name: 'lname',
        type: 'input',
        message: "What is the employee's last name?",
      },
      {
        name: 'role',
        type: 'list',
        message: "What is the employee's role?",
        choices: emptyArrRol_id_name,
      },
      {
        name: 'manager',
        type: 'list',
        message: "What is the employee's manager?",
        choices: emptyArrEmp_id_name,
      },
    ])
    .then(function (answer) {
      function checkEmpty() {
        if (answer.manager === 'None') {
          console.log('I am here');
          return -1;
        } else {
          return answer.manager.charAt(0);
        }
      }

      var query =
        "INSERT INTO employee (first_name, last_name, role_id, manger_id) VALUES ('" +
        answer.fname +
        "', '" +
        answer.lname +
        "', '" +
        answer.role.charAt(0) +
        "', '" +
        checkEmpty() +
        "');";

      connection.query(query, answer, function (err, res) {
        if (err) throw err;
        console.log(answer.fname);
        console.log('Number of records inserted: ' + res.affectedRows);
        whatToDO();
      });
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'department',
        type: 'input',
        message: 'What are the department?',
      },
    ])
    .then(function (answer) {
      console.log(answer.department);
      var query =
        "INSERT INTO department (department_name) VALUES ('" +
        answer.department +
        "');";

      connection.query(query, answer, function (err, res) {
        if (err) throw err;
        console.log(answer.department);
        console.log('Number of records inserted: ' + res.affectedRows);
        console.log('answer');
        console.log(answer);
        whatToDO();
      });
    });
}

function addRoles() {
  // var query = 'SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1';
  // var query2=  'SELECT AUTO_INCREMENT FROM department WHERE = "yourDatabaseName"';

  var query2 = 'SELECT * FROM department';
  connection.query(query2, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].department_name);
      emptyArrDep_id_name.push(`${res[i].id}:${res[i].department_name}`);
    }
  });

  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: "What is the employee's roles?",
      },
      {
        name: 'salary',
        type: 'input',
        message: "What is the employee's salary?",
      },
      {
        name: 'dep',
        type: 'list',
        message: "What is the employee's department?",
        choices: emptyArrDep_id_name,
      },
    ])
    .then(function (answer) {
      var query =
        "INSERT INTO employeeRole (title,salary,department_id) VALUES ('" +
        answer.title +
        "', '" +
        answer.salary +
        "', '" +
        answer.dep.charAt(0) +
        "');";

      connection.query(query, answer, function (err, res) {
        if (err) throw err;
        console.log('Number of records inserted: ' + res.affectedRows);
        whatToDO();
      });
    });
}
