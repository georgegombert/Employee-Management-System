INSERT INTO department (name)
VALUES ('Sales'), ('Enginering'), ('Finance'), ('Legal'), ('Human Resourses'), ('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', '60000', 1), ('Sales Associate', '40000', 1), ('Project Manager', '65000', 2), 
('Lead Engineer', '80000', 2), ('Intern', '25000', 5), ('Lawer', '80000', 4), ('Accountant', '55000', 3), ('Warehouse Associate', '35000', 6);

INSERT INTO employee (first_name, last_name, title_id)
VALUES ('Atticus', 'King', 1), ('Langston', 'Deveraux', 2), ('Larchmont', 'VanDyke', 3), 
('Delores', 'Price', 4), ('Emelda', 'Cherry', 5), ('Norse', 'Regan', 6), ('Dominick', 'Assange', 7);


SELECT employee.first_name, employee.last_name, role.title, role.salary
FROM employee, role
WHERE role.id = title_id

SELECT role.title, role.salary, department.name
FROM role, department
WHERE department.id = department_id

SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name
FROM employee, role, department
WHERE role.id = title_id AND department.id = department_id