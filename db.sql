DROP DATABASE IF EXISTS test;
CREATE DATABASE test;

/* Ref : https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server */
DROP USER IF EXISTS 'foo'@'localhost';
CREATE USER 'foo'@'localhost' IDENTIFIED WITH mysql_native_password BY 'bar';
GRANT ALL ON test.* TO 'foo'@'localhost';

USE test;

CREATE TABLE TODOS
(
	ID INTEGER AUTO_INCREMENT PRIMARY KEY,
	TITLE VARCHAR(25) NOT NULL,
	DESCRIPTION VARCHAR(255),
	CREATION_DATE DATETIME DEFAULT NOW(),
	COMPLETION_TARGET_DATE DATETIME,
	COMPLETION_DATE DATETIME
);

INSERT INTO TODOS(TITLE, DESCRIPTION)
VALUES
('Buy a car', 'Buy a car description goes here...'),
('Buy a house', 'Buy a house description goes here...'),
('Get AWS certification', 'Get AWS certification description goes here');

CREATE TABLE NOTES
(
	ID INTEGER AUTO_INCREMENT PRIMARY KEY,
	TODO_ID INTEGER NOT NULL,
	NOTE_TEXT VARCHAR(255) NOT NULL,
	CREATION_DATE DATETIME DEFAULT NOW(),
	FOREIGN KEY(TODO_ID)
		REFERENCES TODOS(ID)
		ON DELETE CASCADE
);

INSERT INTO NOTES(TODO_ID, NOTE_TEXT)
VALUES
(1, 'Buy a car note 1 goes here...'),
(1, 'Buy a car note 2 goes here...'),
(2, 'Buy a house note 1 goes here...'),
(2, 'Buy a house note 2 goes here...'),
(2, 'Buy a house note 3 goes here...'),
(3, 'Get AWS certification note 1 goes here'),
(3, 'Get AWS certification note 2 goes here'),
(3, 'Get AWS certification note 3 goes here'),
(3, 'Get AWS certification note 4 goes here');