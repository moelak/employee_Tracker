-- DROP DATABASE IF EXISTS employee_rackerDB;
CREATE database employee_rackerDB;

USE employee_rackerDB;

CREATE TABLE employee (
  employee_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL, 
  role_id INT NOT NULL,
  manger_id INT NULL,
  PRIMARY KEY (employee_id)
);

CREATE TABLE employeeRole (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
   id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

-- employee.employee_id, 

SELECT * FROM employee ;
SELECT * FROM employeeRole ;
SELECT * FROM department ;


Select E.employee_id, E.first_name,E.last_name, E.role_id, employeeRole.*, department.*, 
IFNULL(CONCAT(M.first_name," ", M.last_name ),"N/A")as manager 
From employee E Inner Join employeeRole on E.role_id = employeeRole.id 
Inner Join department on  department.id= employeeRole.department_id 
LEFT JOIN employee M ON E.manger_id = M.employee_id;



