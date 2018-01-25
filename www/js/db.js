
var db = null;
/**
 * @param  {String} template
 * @param  {String[]} values
 * @return {String}
 */
function sprintf(template, values) {
  return template.replace(/%s/g, function() {
    return values.shift();
  });
}


var dbString = {
  CREATE : " CREATE TABLE IF NOT EXISTS ",
  DROP : " DROP TABLE IF EXISTS ",
  // If you change the database schema, you must increment the database version.
  DATABASE_VERSION : 13,
  name : "loadWallet.db"
}
/**
 * Plancodes types
 */
var PlancodeTypes =  {
    SMART : "smart",
    SUN : "sun",
    TNT : "tnt",
    PLDT : "pldt",
    MERALCO : "meralco",
    CIGNAL : "cignal",
    GLOBE : "globe",

}
/**
 * Inner class that defines the table contents
 * */
var BillspayCategories  = {
    TABLE_NAME : "billspay_categories",
    COLUMN_NAME : "name",
    COLUMN_DESCRIPTION : "description",
    COLUMN_ID : "id",
    ROW_ID : "row_id",

    getCreateStructure() {
        sprintf("%s%s (%s INTEGER PRIMARY KEY AUTOINCREMENT ,%s text,%s bigint,%s text)", [ CREATE, BillspayCategories.TABLE_NAME, BillspayCategories.ROW_ID, BillspayCategories.COLUMN_DESCRIPTION, BillspayCategories.COLUMN_ID, BillspayCategories.COLUMN_NAME]);
    }
}
var BillspayProducts = {
    TABLE_NAME : "billspay_products",
    COLUMN_ID : "id",
    COLUMN_CATEGORY_ID : "product_category_id",
    COLUMN_SKU : "sku",
    COLUMN_NAME : "name",
    COLUMN_DESCRIPTION : "description",
    ROW_ID : "row_id",

    getCreateStructure() {
        sprintf("%s%s (%s INTEGER PRIMARY KEY AUTOINCREMENT ,%s bigint,%s bigint,%s text,%s text,%s text)", [ CREATE, BillspayProducts.TABLE_NAME, BillspayProducts.ROW_ID, BillspayProducts.COLUMN_ID, BillspayProducts.COLUMN_CATEGORY_ID, BillspayProducts.COLUMN_SKU, BillspayProducts.COLUMN_NAME, BillspayProducts.COLUMN_DESCRIPTION]);
    }
}


var BillspayPayload = {
    TABLE_NAME : "billspay_payload",
    COLUMN_PRODUCT_ID : "product_id",
    COLUMN_FIELD : "field_name",
    COLUMN_DESCRIPTION : "description",
    ROW_ID : "row_id",

    getCreateStructure() {
        sprintf("%s%s (%s INTEGER PRIMARY KEY AUTOINCREMENT ,%s bigint,%s text,%s text)", [ CREATE, BillspayPayload.TABLE_NAME, BillspayPayload.ROW_ID, BillspayPayload.COLUMN_PRODUCT_ID, BillspayPayload.COLUMN_FIELD, BillspayPayload.COLUMN_DESCRIPTION]);
    }
}

var Telco  = {
    TABLE_NAME : "telco",
    COLUMN_NAME : "name",
    COLUMN_ID : "telco_id",
    ROW_ID : "row_id",

    getCreateStructure() {
        sprintf("%s%s (%s INTEGER PRIMARY KEY AUTOINCREMENT ,%s int,%s text)", [ CREATE, Telco.TABLE_NAME, Telco.ROW_ID, Telco.COLUMN_ID, Telco.COLUMN_NAME]);
    }
}
var Prefix = {
    TABLE_NAME : "prefix",
    COLUMN_PREFIX : "prefix",
    COLUMN_TELCOID : "telco_id",
    ROW_ID : "row_id",

    getCreateStructure() {
        sprintf("%s%s (%s INTEGER PRIMARY KEY AUTOINCREMENT ,%s int,%s text)", [ CREATE, Prefix.TABLE_NAME, Prefix.ROW_ID, Prefix.COLUMN_TELCOID, Prefix.COLUMN_PREFIX]);
    }
}
var Plancodes = {
    TABLE_NAME : "plancodes",
    COLUMN_ID : "plancode_id",
    COLUMN_USER : "user_id",
    COLUMN_TELCO : "telco_id",
    COLUMN_LIST_PRICE : "list_price",
    COLUMN_RETAIL_PRICE : "retail_price",
    COLUMN_PRODUCT_TYPE : "product_type",
    COLUMN_TYPE : "type",
    COLUMN_NAME : "name",
    COLUMN_ALIAS : "alias",
    COLUMN_DESCRIPTION : "description",
    ROW_ID : "row_id",

    getCreateStructure() {
        sprintf("%s%s (%s INTEGER PRIMARY KEY AUTOINCREMENT ,%s bigint,%s bigint,%s bigint,%s text,%s text,%s text,%s DECIMAL(10,5),%s DECIMAL(10,5),%s text,%s text)", [ CREATE, Plancodes.TABLE_NAME, Plancodes.ROW_ID, Plancodes.COLUMN_ID, Plancodes.COLUMN_USER, Plancodes.COLUMN_TELCO, Plancodes.COLUMN_NAME, Plancodes.COLUMN_ALIAS, Plancodes.COLUMN_DESCRIPTION, Plancodes.COLUMN_LIST_PRICE, Plancodes.COLUMN_RETAIL_PRICE, Plancodes.COLUMN_TYPE, Plancodes.COLUMN_PRODUCT_TYPE]);
    }
}
var Users = {
    TABLE_NAME : "users",
    COLUMN_ID : "id",
    COLUMN_PARENT : "parent",
    COLUMN_USERNAME : "username",
    COLUMN_EMAIL : "email",
    COLUMN_ROLE : "role",
    COLUMN_TYPE : "type",
    COLUMN_FIRSTNAME : "firstname",
    COLUMN_LASTNAME : "lastname",
    COLUMN_COMPANYNAME : "company_name",
    COLUMN_MOBILE : "mobile",
    ROW_ID : "row_id",

    getCreateStructure() {
        sprintf("%s%s (%s INTEGER PRIMARY KEY AUTOINCREMENT ,%s bigint,%s bigint,%s text,%s text,%s text,%s text,%s text,%s text,%s text,%s text)", [ CREATE, Users.TABLE_NAME, Users.ROW_ID, Users.COLUMN_ID, Users.COLUMN_PARENT, Users.COLUMN_USERNAME, Users.COLUMN_EMAIL, Users.COLUMN_ROLE, Users.COLUMN_TYPE, Users.COLUMN_FIRSTNAME, Users.COLUMN_LASTNAME, Users.COLUMN_COMPANYNAME, Users.COLUMN_MOBILE]);
    }
}

console.log('db oject init');

 
document.addEventListener('deviceready', function() {
  db = window.sqlitePlugin.openDatabase({name: dbString.name, location: 'default'});

  db.transaction(function(tx) {
    tx.executeSql(Users.getCreateStructure());
  }, function(error) {
    console.log('Transaction ERROR: ' + error.message);
  }, function(tx, result) {
    console.log('created database OK');
  });
});