INSERT INTO department (department_name)
VALUES ("SALES"),
       ("ENGINEERING"),
       ("HR"),
       ("SERVICE"),
       ("LEGAL");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Unit Manager", 90000, 3),
    ("Salesperson", 60000, 4),
    ("Software Engineer", 123100, 1),
    ("Accountant", 12399, 2);

INSERT INTO employee(first_name, last_name)
VALUES
    ("MJ", "MJ"),
    ("Steve", "White"),
    ("Sean", "Jag"),
    ("Prince", "Larue"),
    ("Harry", "Wang");