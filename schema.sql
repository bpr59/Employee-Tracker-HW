DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

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

INSERT INTO role (title, salary, department_id)
VALUES ("associate_producer", 55000, 1),("producer", 95000, 1),
("production_manager", 125000, 1),("director", 135000, 2),("technical_director", 155500, 3),
("engineer", 200000, 3),("talent", 250000, 4),("vp_production", 350000, 4);

