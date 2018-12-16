DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE productsTable (
  item_id INT NOT NULL AUTO_INCREMENT,
  prod_name VARCHAR(199) NULL,
  dept_name VARCHAR(199) NULL,
  price DECIMAL(10,2) NULL,
  quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("banana", "produce", 0.29, 100);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("chicken", "produce", 4.29, 100);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("couch", "furniture", 300.00, 10);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("jeans", "apparell", 55.29, 10);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("skillet", "kitchen", 25.29, 3);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("smart watch", "electronics", 455.29, 1);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("motor oil", "automotive", 3.29, 4);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("dumbell", "sports", 10.29, 3);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("crossbow", "zombie apocalypse", 222.29, 2);

INSERT INTO productsTable (prod_name, dept_name, price, quantity)
VALUES ("fax machine", "antiques", 11.29, 1);
