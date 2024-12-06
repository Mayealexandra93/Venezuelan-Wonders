document.addEventListener("DOMContentLoaded", () => {
    const cart = []; // Centralized cart definition
  
    // Select DOM elements_885
    const elements_885 = {
      packagesContainer: document.getElementById("packagesContainer"),
      cartIcon: document.getElementById("cartIcon"),
      cartCount: document.getElementById("cartCount"),
      cartSidebar: document.getElementById("cartSidebar"),
      closeSidebar: document.getElementById("closeSidebar"),
      cartItems: document.getElementById("cartItems"),
      checkoutButton: document.getElementById("checkoutButton"),
      totalEl: document.getElementById("totalPrice"),
      totalItemsEl: document.getElementById("totalItems"),
      couponInput: document.getElementById("couponInput"),
      applyCoupon_885Button: document.getElementById("applyCoupon_885"),
      discountInfo: document.getElementById("discountInfo"),      
    };

    
  
    const validCoupons = {
      SAVE10: 0.1, // 10% discount
      SAVE20: 0.2, // 20% discount
    };
  
    let total = 0;
    let discount = 0;

    // ------------------------------
   // Functions: Local Storage Handling
  // ------------------------------

  // Save cart into Browser's Local Storage
  const saveCartToLocalStorage_885 = () => {
    // Step 1: Log Cart Data (Debugging)
    console.log("Saving cart to localStorage:", cart);

    // Step 2: Serialize and Save Data:
    localStorage.setItem("cart", JSON.stringify(cart));
  };

   // Load cart from localStorage
   const loadCartFromLocalStorage_885 = () => {
    // Step 1: Get Data from localStorage
    const savedCart_885 = localStorage.getItem("cart"); 
    console.log("Saved cart from localStorage:", savedCart_885); // Debug

    if (savedCart_885) {
        try {
          // Step 2: Parse the Retrieved Data
            const parsedCart_885 = JSON.parse(savedCart_885);
            console.log("Parsed cart:", parsedCart_885); // Debug

            // Step 3: Validate the Parsed Data:
            if (Array.isArray(parsedCart_885)) {
                cart.push(...parsedCart_885); // Only push if it's an array
            } else {
                console.error("Parsed cart is not an array:", parsedCart_885);
            }
        } catch (error) { // Step 4: Handle Parsing Errors
            console.error("Error parsing cart data from localStorage:", error);
          }
    }
  };

     // ------------------------------
    // Functions: Package Handling
    // ------------------------------
  
    // Load packages from JSON and render them
    const loadPackages_885 = async () => {                     // 1. Asynchronous Function Declaration
        const response = await fetch("./data/packages.json"); // 2. Fetching Data from the JSON File
        const packages = await response.json();              // 3. Parsing the JSON Response
      
        // 4. Rendering Packages Dynamically with map
        elements_885.packagesContainer.innerHTML = packages.map((pkg, index) => 
        // 5. Template Literal for Package HTML Structure
          ` 
          <div class="package" data-aos="fade-up">
            <img src="${pkg.image}" alt="${pkg.name}" width="200">
            <h3>${pkg.name}</h3>
            <p>Price: $${pkg.price}</p>
            <p>People: ${pkg.people}</p>
            <p>Duration: ${pkg.duration} days</p>
            <p>Departure: ${pkg.departureCity}</p>
            <p>Rating: ${"⭐".repeat(Math.floor(Math.random() * 5) + 1)}</p>
            <div>
              <button onclick="adjustQuantity_885(${index}, -1)">-</button>
              <span id="quantity-${index}">1</span>
              <button onclick="adjustQuantity_885(${index}, 1)">+</button>
            </div>
            <button onclick="addToCart_885(${index})">Add to Cart</button>
          </div>
          `
          ).join(""); // 6. Injecting the HTML into the Page
      };
        
    // ------------------------------
    // Functions: Utility Operations
    // ------------------------------
  
    // Adjust package quantity before adding to the cart
    window.adjustQuantity_885 = (index, change) => {
      const quantityEl = document.getElementById(`quantity-${index}`);
      let quantity = parseInt(quantityEl.textContent, 10) + change;
      quantity = Math.max(1, quantity);
      quantityEl.textContent = quantity;
    };

    // Update the cart count displayed on the cart icon
    function updateCartCount_885() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        elements_885.cartCount.textContent = totalItems;
    }
  
    // Update the cart items in the sidebar
    const updateCartSidebar_885 = () => {
      elements_885.cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <div class="item-pic">
            <div id="item_descrip">
              <h3>${item.name}</h3>
              <p>Price: $${item.price}</p>
              <p>People: ${item.people}</p>
              <p>Duration: ${item.duration} days</p>
              <p>Departure: ${item.departureCity}</p>
              <p>Quantity: ${item.quantity}</p>
            </div>
            <div id="car_img">
              <img src=${item.image} alt="Cart" width="150" height="90">
            </div>
          </div>
          <div class="cart-item-actions">
            <button onclick="adjustCartQuantity_885(${index}, -1)">-</button>
            <button onclick="adjustCartQuantity_885(${index}, 1)">+</button>
            <button onclick="removeFromCart_885(${index})">Remove</button>
          </div>
        </div>
      `).join("");
    };
  
    // Update the order summary (total, travel packages count, discount)
    const updateOrderSummary_885 = () => {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      elements_885.totalEl.textContent = `Total Price: $${(total - discount).toFixed(2)}`;
      elements_885.totalItemsEl.textContent = `Total Items: ${totalItems}`;
    };

  
  // ------------------------------
  // Functions: Cart Management
  // ------------------------------

  // Add a package to the cart
  window.addToCart_885 = (index) => {
    // 1. Getting the Selected Quantity
    const quantityEl = document.getElementById(`quantity-${index}`);
    const quantity = parseInt(quantityEl.textContent, 10);

    // 2. Fetching Package Data
    fetch("./data/packages.json").then(res => res.json()).then(packages => {
      // 3. Checking if the Package is Already in the Cart
      const pkg = packages[index];
      const existingItem = cart.find(item => item.name === pkg.name);

      // 4. Updating the Cart
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ ...pkg, quantity });
      }

      // 5. Updating the UI
      updateCartCount_885();
      updateCartSidebar_885();
      updateOrderSummary_885();
      saveCartToLocalStorage_885(); // 6. Saving to Local Storage
    });
  };
  
    // Adjust item quantity in the cart
    window.adjustCartQuantity_885 = (index, change) => {
      cart[index].quantity += change;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
  
      updateCartCount_885();
      updateCartSidebar_885();
      updateOrderSummary_885();
      saveCartToLocalStorage_885(); // Save changes to local storage
    };
  
    // Remove an item from the cart
    window.removeFromCart_885 = (index) => {
      cart.splice(index, 1);
      updateCartCount_885();
      updateCartSidebar_885();
      updateOrderSummary_885();
      saveCartToLocalStorage_885(); // Save changes to local storage
    };
  

  
    // Apply a discount coupon
    const applyCoupon_885 = () => {
      const couponCode = elements_885.couponInput.value.trim().toUpperCase();
      if (validCoupons[couponCode]) {
        const discountRate = validCoupons[couponCode];
        discount = total * discountRate;
  
        // Update UI
        elements_885.discountInfo.style.display = "block";
        elements_885.discountInfo.textContent = `Discount Applied: -$${discount.toFixed(2)} (${couponCode})`;
        elements_885.couponInput.style.display = "none";
        elements_885.applyCoupon_885Button.style.display = "none";
  
        // Update total
        updateOrderSummary_885();
      } else {
        toastr.error("Invalid coupon code! Please try again.");
      }
    };

    // ------------------------------
    // Clear All Button Functionality
    // ------------------------------

    const clearAllCart_885 = () => {
      cart.length = 0;  // Clear all items in the cart

      updateCartCount_885(); // Update the cart count
      updateCartSidebar_885(); // Update the cart sidebar
      updateOrderSummary_885(); // Update the order summary
      saveCartToLocalStorage_885(); // Save changes to local storage
    };

    // Add event listener to the Clear All button
    document.getElementById("clearAllButton").addEventListener("click", clearAllCart_885);
  
    // ------------------------------
    // Initialization
    // ------------------------------
      
    loadCartFromLocalStorage_885(); // Load the cart from local storage on page load
    updateCartSidebar_885(); // Update the cart UI with loaded items
    updateCartCount_885(); // Update the cart count with loaded items
    updateOrderSummary_885(); // Update the order summary with loaded items
    
    loadPackages_885(); // Load packages on page load

    // Initialize AOS animations. Uninitialized animations might set opacity: 0 by default.
        AOS.init(); 

     // Toggle sidebar visibility
     const toggleSidebar_885 = () => elements_885.cartSidebar.classList.toggle("open");

    // ------------------------------
    // Event Listeners
    // ------------------------------

      elements_885.cartIcon.addEventListener("click", toggleSidebar_885);
      elements_885.closeSidebar.addEventListener("click", toggleSidebar_885);
      elements_885.checkoutButton.addEventListener("click", () => alert("Proceed to payment page!"));
      elements_885.applyCoupon_885Button.addEventListener("click", applyCoupon_885);

  });
  