DROP DATABASE IF EXISTS employee_hwDB;
CREATE database employee_hwDB;

USE employee_hwDB;

CREATE TABLE department(
  id int NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department(dept_name)
VALUES ("production"), ("engineering"), ("studio_directing"), ("management");

INSERT INTO role (title, salary, department_id)
VALUES ("associate_producer", 55000, 1),("producer", 95000, 1),
("production_manager", 125000, 1),("director", 135000, 2),("technical_director", 155500, 3),
("engineer", 200000, 3),("talent", 250000, 4),("vp_production", 350000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jonathan", "Smith", 1, 3),("Peter", "Rivers", 1, 3),("Monica", "Rivera", 2, 3),("Karla", "Tovar", 3, 8),
("Cesar", "Gregorious", 4, 0),("Carlos", "Thompson", 5, 6),("Mayra", "Liverpool", 6, 0),("Rachel", "Nichols", 7, 8),
("Jorge", "Knight", 8, 0);