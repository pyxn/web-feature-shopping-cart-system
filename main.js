/* ---------------------------------------------------
    Shopping Cart System by Pao Yu         
------------------------------------------------------*/

/* -----------------------------------------------------
    Class declaration that represents any product with
    a unique id, name, filename, caption, and price.
------------------------------------------------------*/
class Product {
    constructor(id, name, filename, caption, price) {
        this.id = id;
        this.name = name;
        this.filename = filename;
        this.caption = caption;
        this.price = price;
    }
}

/* -----------------------------------------------------
    Declaration of dataset used to populate the site's
    recommended products table. There are 12 total items.
------------------------------------------------------*/
let recommended_products = [
    new Product( 0,     'AirPods Pro',      'airpods-pro.png',      'White',            329     ),
    new Product( 1,     'HomePod Mini',     'homepod-mini.png',     'Silver',           129     ),
    new Product( 2,     'iMac',             'imac.png',             'M1 27" Blue',      1539    ),
    new Product( 3,     'iPad Air',         'ipad-air.png',         'White',            719     ),
    new Product( 4,     'iPad Mini',        'ipad-mini.png',        'Silver/White',     499     ),
    new Product( 5,     'iPad Pro',         'ipad-pro.png',         'Space Gray',       939     ),
    new Product( 6,     'iPad',             'ipad.png',             'Silver/White',     399     ),
    new Product( 7,     'Mac Mini',         'mac-mini.png',         'M1 Silver',        829     ),
    new Product( 8,     'Mac Pro',          'mac-pro.png',          'Tower',            6999    ),
    new Product( 9,     'MacBook Air',      'macbook-air.png',      'M1 13" Silver',    1169.00 ),
    new Product(10,     'MacBook Pro',      'macbook-pro.png',      'M1 13" Silver',    1569.00 ),
    new Product(11,     'Pro Display XDR',  'pro-display-xdr.png',  'Standard Glass',   5789    )
];

/* -----------------------------------------------------
    Create an empty map object to track the items 
    that are to be added to the cart.
------------------------------------------------------*/
let shopping_cart = new Map();

/* -----------------------------------------------------
    Create a superset of indices that can be later
    used for set operations.
------------------------------------------------------*/
let recommended_index_array_superset = new Array(recommended_products.length);

/* -----------------------------------------------------
    Create an empty array A to contain half of the
    elements of the superset. Not initialized.
------------------------------------------------------*/
let recommended_index_array_setA;

/* -----------------------------------------------------
    Create an empty array B to contain hald of the 
    elements of the superset. Not initialized.
------------------------------------------------------*/
let recommended_index_array_setB;

/* -----------------------------------------------------
    Create a tracking mechanism to see which
    set (A or B) is currently being displayed.
------------------------------------------------------*/
let is_using_setA;

/* -----------------------------------------------------
    Fill the superset with indices according to the
    total length of the dataset array.
------------------------------------------------------*/
for (let i = 0; i < recommended_products.length; i++) {
    recommended_index_array_superset[i] = i;
}

/* -----------------------------------------------------
    The main entry point of the program. main() will 
    only load once all DOM elements are loaded by the
    body so that it can properly detect elements.
------------------------------------------------------*/
function main() {

    let recommended_index_set = new Set();
    let recommended_products_length = recommended_products.length;

    /* -----------------------------------------------------
        Generate a set of 6 unique elements
        using random integers within the range
        of the dataset length.
    ------------------------------------------------------*/
    while (Array.from(recommended_index_set).length < 6) {
        const random_index = Math.floor(Math.random() * recommended_products_length);
        recommended_index_set.add(random_index);
    }

    /* -----------------------------------------------------
        Populate Set A and Set B
    ------------------------------------------------------*/
    recommended_index_array_setA = Array.from(recommended_index_set);
    recommended_index_array_setB = Array.from(getSetDifference(recommended_index_array_superset, recommended_index_array_setA));

    /* -----------------------------------------------------
        Dynamically insert code for each product on set A
        and set the tracker to true to indicate set A
        is currently being displayed.
    ------------------------------------------------------*/
    recommended_index_array_setA.forEach(insert_recommended_product);
    is_using_setA = true;
}

/* -----------------------------------------------------
    Switches between sets and recreates the recommended
    products table depending on which set is being
    displayed on the screen.
------------------------------------------------------*/
function switch_recommended_products() {
    if (is_using_setA == true) {
        recommended_index_array_setB.forEach(insert_recommended_product);
    } else {
        recommended_index_array_setA.forEach(insert_recommended_product);
    }
    is_using_setA = !is_using_setA;
}

/* -----------------------------------------------------
    Dynamically inserts code from elements
    looped through using Array.ForEach method.
------------------------------------------------------*/
function insert_recommended_product(random_index, current_index) {
    let element_id = "recommended-product-" + (current_index + 1);
    let product = recommended_products[random_index];
    let name = product.name;
    let caption = product.caption;
    let filename = product.filename;
    let price = (product.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const code = `
    <figure id="product-id-${random_index}">
        <img src='./products/${ filename }' class='image-cell' alt=''>
        <figcaption class='caption-image'>${name}</figcaption>
        <figcaption class='caption-text'>${caption} - ${price}</figcaption>
    </figure>`;
    document.getElementById(element_id).innerHTML = code;
}

/* -----------------------------------------------------
    Adds an item to the shopping cart map data
    structure by extracting the product ID from the
    passed element and updating the cart once the 
    map object is updated.
------------------------------------------------------*/
function add_to_cart(element) {
    let product_id = element.children[0].id.split("-")[2];
    let product = recommended_products[product_id];
    let product_quantity = shopping_cart.get(product);
    if (product_quantity == null) {
        product_quantity = 1;
    } else {
        product_quantity++;
    }
    shopping_cart.set(product, product_quantity);
    update_cart();
}

/* -----------------------------------------------------
    Dynamically updates the entirety of the shopping
    cart table by recreating the rows for each entry
    that exists within the shopping cart map object.

    The total quantity and total amount is also
    calculated here, updating the necessary elements
    that reflect this information.
------------------------------------------------------*/
function update_cart() {
    let total_value = 0;
    let total_quantity = 0;
    /* -----------------------------------------------------
        Loop through each entry of the map and acquire its data
    ------------------------------------------------------*/
    shopping_cart.forEach(function (product_quantity, product) {
        /* -----------------------------------------------------
            Update the total amounts
        ------------------------------------------------------*/
        total_value += product_quantity * product.price;
        total_quantity += product_quantity;
        let product_id = product.id;
        let product_name = product.name;
        let product_caption = product.caption;
        let product_price = (product.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        let list_item = `
            <tr class="shopping-cart-list-item">
                <td>${product_name}</td>
                <td>${product_caption}</td>
                <td>${product_price}</td>
                <td>${product_quantity}</td>
                <td>
                    <button value="${product_id}" onclick="decrease_product_quantity(this.value)">-</button>
                    <button value="${product_id}" onclick="increase_product_quantity(this.value)">+</button>
                    <button value="${product_id}" onclick="remove_product(this.value)" class="remove">×</button>
                </td>
            </tr>`;

        /* -----------------------------------------------------
            If the product is already in the table,
            just update the code that is currently there.
        ------------------------------------------------------*/
        let shopping_cart_list_item = document.getElementById(`"shopping-cart-list-item-id-${product_id}"`);
        if (shopping_cart_list_item != null) {
            shopping_cart_list_item.innerHTML = list_item;
        /* -----------------------------------------------------
            Else, if the product is not yet on the table,
            create new elements to append to the table using
            the new data.
        ------------------------------------------------------*/
        } else {
            let row = document.createElement("tr")
            row.setAttribute("id", `"shopping-cart-list-item-id-${product_id}"`);
            row.innerHTML = list_item;
            let shopping_cart_list = document.getElementById('shopping-cart-list');
            shopping_cart_list.append(row);
        }
    });
    /* -----------------------------------------------------
        Acuire and update elements that reflect the 
        total quantity and amount in the shopping cart.
    ------------------------------------------------------*/
    let total_element_amount = document.getElementById("shopping-cart-list-total");
    let total_element_quantity = document.getElementById("shopping-cart-list-quantity");
    let total_element_quantity_aside = document.getElementById("cart-quantity");
    total_element_amount.innerHTML = total_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    total_element_quantity.innerHTML = total_quantity;
    total_element_quantity_aside.innerHTML = total_quantity;
}

/* -----------------------------------------------------
    Decreases the quantity (map value) of
    a product (map key) within the shopping cart map
    and updates the table for quantity updates and
    zero-quantity row deletions.
------------------------------------------------------*/
function decrease_product_quantity(product_id) {
    let product = recommended_products[product_id];
    let product_quantity = shopping_cart.get(product);
    if (product_quantity != null) {
        product_quantity--;
        shopping_cart.set(product, product_quantity);
    }
    if (product_quantity == 0) {
        shopping_cart.delete(product);
        document.getElementById(`"shopping-cart-list-item-id-${product_id}"`).outerHTML = "";
    }
    update_cart();
}

/* -----------------------------------------------------
    Increases the quantity (map value) of
    a product (map key) within the shopping cart map
    and updates the table for quantity updates.
------------------------------------------------------*/
function increase_product_quantity(product_id) {
    let product = recommended_products[product_id];
    let product_quantity = shopping_cart.get(product);
    if (product_quantity != null) {
        product_quantity++;
        shopping_cart.set(product, product_quantity);
    }
    update_cart();
}

/* -----------------------------------------------------
    Removes a product from the shopping cart map
    and updates the shopping cart list table after
    a successfull confirmation message is acquired
    from the user.
------------------------------------------------------*/
function remove_product(product_id) {
    let product = recommended_products[product_id];
    let product_name = product.name;
    let product_quantity = shopping_cart.get(product);
    let removeConfirmed = confirm(`Confirmation: Remove ${ product_quantity } item(s) of ${ product_name } from cart?`);
    if (removeConfirmed == true) {
        shopping_cart.delete(product);
        document.getElementById(`"shopping-cart-list-item-id-${product_id}"`).outerHTML = "";
        update_cart();
    }
}

/* -----------------------------------------------------
    A set difference operation which removes
    all elements that exist in setB from setA.
------------------------------------------------------*/
function getSetDifference(setA, setB) {
    let _difference = new Set(setA);
    for (let each_element of setB) {
        _difference.delete(each_element)
    }
    return _difference
}