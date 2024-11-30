document.addEventListener("DOMContentLoaded", () => {
    const cart = []; // Centralized cart definition
  
    // Select DOM elements
    const elements = {
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
      applyCouponButton: document.getElementById("applyCoupon"),
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
   // Load cart from localStorage
   const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart");
    console.log("Saved cart from localStorage:", savedCart); // Debug

    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            console.log("Parsed cart:", parsedCart); // Debug

            if (Array.isArray(parsedCart)) {
                cart.push(...parsedCart); // Only push if it's an array
            } else {
                console.error("Parsed cart is not an array:", parsedCart);
            }
        } catch (error) {
            console.error("Error parsing cart data from localStorage:", error);
          }
    }
  };

  const saveCartToLocalStorage = () => {
      console.log("Saving cart to localStorage:", cart); // Debug
      localStorage.setItem("cart", JSON.stringify(cart));
  };

     // ------------------------------
    // Functions: Package Handling
    // ------------------------------
  
    // Load packages from JSON and render them
    const loadPackages = async () => {
        const response = await fetch("./data/packages.json");
        const packages = await response.json();
    
        elements.packagesContainer.innerHTML = packages.map((pkg, index) => `
          <div class="package" data-aos="fade-up">
            <img src="${pkg.image}" alt="${pkg.name}" width="200">
            <h3>${pkg.name}</h3>
            <p>Price: $${pkg.price}</p>
            <p>People: ${pkg.people}</p>
            <p>Duration: ${pkg.duration} days</p>
            <p>Departure: ${pkg.departureCity}</p>
            <p>Rating: ${"⭐".repeat(Math.floor(Math.random() * 5) + 1)}</p>
            <div>
              <button onclick="adjustQuantity(${index}, -1)">-</button>
              <span id="quantity-${index}">1</span>
              <button onclick="adjustQuantity(${index}, 1)">+</button>
            </div>
            <button onclick="addToCart(${index})">Add to Cart</button>
          </div>
        `).join("");
      };

    
    // Toggle sidebar visibility
      const toggleSidebar = () => elements.cartSidebar.classList.toggle("open");
    
  
    // ------------------------------
    // Functions: Utility Operations
    // ------------------------------
  
    // Update the cart count displayed on the cart icon
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = totalItems;
    }
  
    // Update the cart items in the sidebar
    const updateCartSidebar = () => {
      elements.cartItems.innerHTML = cart.map((item, index) => `
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
            <button onclick="adjustCartQuantity(${index}, -1)">-</button>
            <button onclick="adjustCartQuantity(${index}, 1)">+</button>
            <button onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
      `).join("");
    };
  
    // Update the order summary (total, travel packages count, discount)
    const updateOrderSummary = () => {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      elements.totalEl.textContent = `Total Price: $${(total - discount).toFixed(2)}`;
      elements.totalItemsEl.textContent = `Total Items: ${totalItems}`;
    };

  
  // ------------------------------
  // Functions: Cart Management
  // ------------------------------

  // Add a package to the cart
  window.addToCart = (index) => {
    const quantityEl = document.getElementById(`quantity-${index}`);
    const quantity = parseInt(quantityEl.textContent, 10);

    fetch("./data/packages.json").then(res => res.json()).then(packages => {
      const pkg = packages[index];
      const existingItem = cart.find(item => item.name === pkg.name);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ ...pkg, quantity });
      }

      updateCartCount();
      updateCartSidebar();
      updateOrderSummary();
      saveCartToLocalStorage(); // Save changes to local storage
    });
  };
  
    // Adjust item quantity in the cart
    window.adjustCartQuantity = (index, change) => {
      cart[index].quantity += change;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
  
      updateCartCount();
      updateCartSidebar();
      updateOrderSummary();
      saveCartToLocalStorage(); // Save changes to local storage
    };
  
    // Remove an item from the cart
    window.removeFromCart = (index) => {
      cart.splice(index, 1);
      updateCartCount();
      updateCartSidebar();
      updateOrderSummary();
      saveCartToLocalStorage(); // Save changes to local storage
    };
  
    // Adjust package quantity before adding to the cart
    window.adjustQuantity = (index, change) => {
      const quantityEl = document.getElementById(`quantity-${index}`);
      let quantity = parseInt(quantityEl.textContent, 10) + change;
      quantity = Math.max(1, quantity);
      quantityEl.textContent = quantity;
    };
  
    // Apply a discount coupon
    const applyCoupon = () => {
      const couponCode = elements.couponInput.value.trim().toUpperCase();
      if (validCoupons[couponCode]) {
        const discountRate = validCoupons[couponCode];
        discount = total * discountRate;
  
        // Update UI
        elements.discountInfo.style.display = "block";
        elements.discountInfo.textContent = `Discount Applied: -$${discount.toFixed(2)} (${couponCode})`;
        elements.couponInput.style.display = "none";
        elements.applyCouponButton.style.display = "none";
  
        // Update total
        updateOrderSummary();
      } else {
        alert("Invalid coupon code! Please try again.");
      }
    };

    // ------------------------------
    // Clear All Button Functionality
    // ------------------------------

    const clearAllCart = () => {
      cart.length = 0;  // Clear all items in the cart

      updateCartCount(); // Update the cart count
      updateCartSidebar(); // Update the cart sidebar
      updateOrderSummary(); // Update the order summary
      saveCartToLocalStorage(); // Save changes to local storage
    };

    // Add event listener to the Clear All button
    document.getElementById("clearAllButton").addEventListener("click", clearAllCart);
  
    // ------------------------------
    // Initialization
    // ------------------------------
      
    loadCartFromLocalStorage(); // Load the cart from local storage on page load
    updateCartSidebar(); // Update the cart UI with loaded items
    updateCartCount(); // Update the cart count with loaded items
    updateOrderSummary(); // Update the order summary with loaded items
    
    loadPackages(); // Load packages on page load

    // Initialize AOS animations. Uninitialized animations might set opacity: 0 by default.
        AOS.init(); 


    // ------------------------------
    // Event Listeners
    // ------------------------------

      elements.cartIcon.addEventListener("click", toggleSidebar);
      elements.closeSidebar.addEventListener("click", toggleSidebar);
      elements.checkoutButton.addEventListener("click", () => alert("Proceed to payment page!"));
      elements.applyCouponButton.addEventListener("click", applyCoupon);

  });
  