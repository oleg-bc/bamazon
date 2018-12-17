var Table = require('easy-table')
var inquirer = require("inquirer");
var mysql = require("mysql");
//====HANDLES DB DISPLAY=====
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
    readProds();
    //connection.end();
});
function afterConnection() {
    connection.query("SELECT * FROM productsTable", function (err, res) {
        if (err) throw err;
    });
}
var firstRun=true;
function readProds() {
    console.log("Selecting all Prods...\n");
    connection.query("SELECT * FROM productsTable", function (err, res) {
        if (err) throw err;
        var productsFromDB = res;
        var t2 = new Table;
        productsFromDB.forEach(function (product, i) {
            t2.cell('Prod ID', product.item_id)
            t2.cell('Prod Name', product.prod_name)
            t2.cell('Dept Name', product.dept_name)
            //shut this down before release
            t2.cell('Prod Qty', product.quantity)
            t2.cell('Price', product.price)
            t2.cell('Price, USD', product.price, Table.number(2))
            t2.newRow()
        })
        console.log(t2.toString())
        if (firstRun==true){
        callInquirer();
        firstRun=false;
        }else{
            process.exit();
        }
    });
}
//===END DISPLAY==========

//=====HANDLES INQUIRER
var selectedId, selectedAmount;
function callInquirer() {
    // Create a "Prompt" with a series of questions.
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: "Select the item ID you want to buy",
                name: "selectedItemID"
            },
            {
                type: "input",
                message: "How many units would you like?",
                name: "selectedUnits"
            }
        ])
        .then(function (inquirerResponse) {
            // If the inquirerResponse confirms, we displays the inquirerResponse
            if (inquirerResponse) {
                console.log("\nYour item id is " + inquirerResponse.selectedItemID);
                console.log("And you'd like  " + inquirerResponse.selectedUnits + " of them\n");
                selectedId = inquirerResponse.selectedItemID;
                selectedAmount = inquirerResponse.selectedUnits;
                checkProdQuantity(inquirerResponse);
            }
            else {
                console.log("\n no reponse provided, come again when you are more sure.\n");
            }
        });
}
////=========END INQUIRER============
var newQuantity;
function checkProdQuantity(userInput) {
    connection.query("SELECT * FROM productsTable WHERE item_id=" + userInput.selectedItemID, function (err, res) {
        if (err) throw err;
        if (res[0].quantity < selectedAmount) {
            console.log("Insufficient quantity in stock!!");
            process.exit();
        } else {
            console.log("ORDER SUCCESSFULL");
            console.log("YOUR ORDER TOTAL IS   " + res[0].price);
            var newAmt = res[0].quantity - selectedAmount
            updateProduct(newAmt, userInput.selectedItemID);
        }
    });
}
//new
function updateProduct(newQuantity, temProdID) {
    console.log("Updating product quantity...\n");
    var query = connection.query(
        "UPDATE productsTable SET  ? WHERE ?",
        [
            {
                quantity: newQuantity
            },
            {
                item_id: temProdID
            }
        ],
        function (err, res) {
            console.log(res.affectedRows + " products updated!\n");
            readProds();
            
        }
    );
}
