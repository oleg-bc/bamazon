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
        callInquirer();
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
        console.log("res is now (inside checkProd...) is     ");
        console.log(res);
        if (res[0].quantity < selectedAmount) {
            console.log("not enough!!");
        }else{
            console.log("order successful");
            var newAmt = res[0].quantity-selectedAmount
            updateProduct(newAmt, userInput.selectedItemID);
        }
    });
}

//new
function updateProduct(newQuantity,temProdID) {
    console.log("Updating product quantity...\n");
      var query = connection.query(
      "UPDATE productsTable SET  ? WHERE ?", 
    //   newQuantity,
    //   temProdId,
      [
        {
            quantity: newQuantity
        },
        {
            item_id:temProdID
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
        //-----------experiment printing one-----------
        readProds();
        //-----------experiment -----------
        // Call deleteProduct AFTER the UPDATE completes
         }
    );
}


//old

// function updateQuantity() {
//     console.log("Updating product quantity...\n");
    
//     var query = connection.query(
//       "UPDATE productsTable SET ? WHERE item_id = " + 
//       newQuantity;
//       userInput.selectedItemID,
     
//       function(err, res) {
//         console.log(res.affectedRows + " products updated!\n");
//         // Call deleteProduct AFTER the UPDATE completes
        
//       }
//     );
  

// TODO:
//1. use the USER INPUT vars to change db
    // 2. check if user amount is less than stock amount  -- if y notify with error
    // --2.1 if n decrement amount   
    // 