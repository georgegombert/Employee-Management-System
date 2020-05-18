INSERT INTO department (department_name)
VALUES ('Sales'), ('Enginering'), ('Finance'), ('Legal'), ('Human Resourses'), ('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', '60000', 1), ('Sales Associate', '40000', 1), ('Project Manager', '65000', 2), 
('Lead Engineer', '80000', 2), ('Intern', '25000', 5), ('Lawer', '80000', 4), ('Accountant', '55000', 3), ('Warehouse Associate', '35000', 6);

INSERT INTO employee (first_name, last_name, title_id, manager_id)
VALUES ('Atticus', 'King', 1, 3), ('Langston', 'Deveraux', 2, 1), ('Larchmont', 'VanDyke', 3, 1), 
('Delores', 'Price', 4, 7), ('Emelda', 'Cherry', 5, 7), ('Norse', 'Regan', 6, 5), ('Dominick', 'Assange', 7, 1);