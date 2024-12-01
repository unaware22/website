// Toggle
const hamburgerBtn = document.getElementById('navbar-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
});


// Filter Button

// Get filter buttons and menu items
const filterButtons = document.querySelectorAll('.filter-button');
const menuItems = document.querySelectorAll('.menu-item');

// Function to apply filter
function applyFilter(filter) {
  // Highlight the active button
  filterButtons.forEach((btn) => {
    btn.classList.remove('bg-yellow-500');
    btn.classList.add('bg-gray-700');
  });
  const activeButton = document.querySelector(`.filter-button[data-filter="${filter}"]`);
  if (activeButton) {
    activeButton.classList.add('bg-yellow-500');
    activeButton.classList.remove('bg-gray-700');
  }

  // Show/Hide menu items based on filter
  menuItems.forEach((item) => {
    if (filter === 'all' || item.getAttribute('data-category') === filter) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Default: Apply 'All' filter on page load
applyFilter('all');

// Add event listener to each filter button
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    applyFilter(filter);
  });
});




// CART
 
  const toggleCartButton = document.getElementById('toggleCartButton');
  const closeCartButton = document.getElementById('closeCartButton');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutButton = document.getElementById('checkoutButton');

  let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage

  // Open cart
  toggleCartButton.addEventListener('click', () => {
    cartSidebar.classList.remove('translate-x-full');
    toggleCartButton.classList.add('hidden'); 
    renderCartItems();
  });

  // Close cart
  closeCartButton.addEventListener('click', () => {
    cartSidebar.classList.add('translate-x-full');
    toggleCartButton.classList.remove('hidden');
  });

  // Add item to cart
  function addToCart(button) {
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'), 10);
    const image = button.getAttribute('data-image');

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1; // Tambahkan jumlah
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    saveCart();
    renderCartItems();

    Swal.fire({
      position: "center",
      icon: "success",
      title: `${name} berhasil ditambahkan ke keranjang!`,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  // Remove item from cart
  function removeFromCart(index) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Item has been removed from your cart.",
          icon: "success",
        });
        cart.splice(index, 1); // Hapus item
        saveCart();
        renderCartItems();
      }
    });
  }

  // Increase item quantity
  function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    renderCartItems();
  }

  // Decrease item quantity
  function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      removeFromCart(index);
      return;
    }
    saveCart();
    renderCartItems();
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Render cart items
  function renderCartItems() {
    cartItems.innerHTML = ''; // Clear previous items

    let total = 0;

    cart.forEach((item, index) => {
      const { name, price, image, quantity } = item;
      total += price * quantity;

      const itemElement = document.createElement('div');
      itemElement.classList.add('flex', 'items-center', 'justify-between', 'bg-gray-800', 'p-4', 'rounded', 'mb-2');

      itemElement.innerHTML = `
        <div class="flex items-center">
          <img src="${image}" alt="${name}" class="w-16 h-16 object-cover rounded mr-4">
          <div>
            <h3 class="font-semibold">${name}</h3>
            <p class="text-sm text-gray-400">Rp. ${price.toLocaleString('id-ID')} x ${quantity}</p>
          </div>
        </div>
        <div class="flex items-center">
          <button class="px-2 py-1 text-sm bg-gray-700 text-white rounded mr-2" onclick="decreaseQuantity(${index})">-</button>
          <button class="px-2 py-1 text-sm bg-gray-700 text-white rounded" onclick="increaseQuantity(${index})">+</button>
          <button 
            class="ml-4 text-red-500 hover:text-red-700 transition"
            onclick="removeFromCart(${index})">
            Remove
          </button>
        </div>
      `;

      cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = `Rp. ${total.toLocaleString('id-ID')}`;
  }

  // Checkout
  checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Your Cart is Empty",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Thank you for your purchase!",
      text: `Total: Rp. ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('id-ID')}`,
      icon: "success",
    });

    cart = [];
    saveCart();
    renderCartItems();
  });

  // Initial render
  renderCartItems();

// API JADWAL
const API_KEY = '1aae3fba4ac64352ba3bc853b0f65389';  // Ganti dengan API Key Anda

// Mendapatkan jadwal buka restoran berdasarkan koordinat
fetch(`https://api.opencagedata.com/geocode/v1/json?q=-6.2088,106.8456&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

// Mendapatkan zona waktu restoran
const timezone = data.results[0].annotations.timezone.name;
        
// Mengambil jadwal buka sesuai zona waktu
const schedule = {
"Asia/Jakarta": {
    "sunday": "10:00 - 21:00",
    "monday": "09:00 - 22:00",
    "tuesday": "09:00 - 22:00",
    "wednesday": "09:00 - 22:00",
    "thursday": "09:00 - 22:00",
    "friday": "09:00 - 23:00",
    "saturday": "10:00 - 23:00"
    }
};

// Mengambil hari-hari untuk ditampilkan
const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const today = new Date().getDay();
const nextDay = (today + 1) % 7;
const selectedDays = [daysOfWeek[today], daysOfWeek[nextDay]];

const scheduleContainer = document.querySelector('.space-y-2');
scheduleContainer.innerHTML = '';  // Kosongkan kontainer sebelum menambahkan data baru

selectedDays.forEach((day, index) => {
const scheduleDiv = document.createElement('div');

// Menentukan gaya background untuk hari pertama dan kedua
const isFirstDay = index === 0;  // Hari pertama (misalnya hari ini)
const backgroundClass = isFirstDay ? 'bg-white text-black' : 'bg-transparent text-white';

    scheduleDiv.className = `
        flex flex-col md:flex-row sm360:flex-row items-center justify-between gap-4 
        p-2 rounded-md border ${backgroundClass}
        `;
    scheduleDiv.innerHTML = `
        <p class="font-bold sm360:text-sm md:text-lg xl:text-xl">${day.toUpperCase()}</p>
        <p class="sm360:text-sm md:text-lg xl:text-xl">${schedule[timezone][day]}</p>
        `;
    scheduleContainer.appendChild(scheduleDiv);
    });
})
.catch(error => console.error("Failed to fetch schedule:", error));


// Book table
const initTables = () => {
  if (!localStorage.getItem("tables")) {
    const defaultTables = [
      { id: 1, status: "Available" },
      { id: 2, status: "Available" },
      { id: 3, status: "Available" },
      { id: 4, status: "Available" },
      { id: 5, status: "Available" },
      { id: 6, status: "Available" },
      { id: 7, status: "Available" },
      { id: 8, status: "Booked" },
    ];
    localStorage.setItem("tables", JSON.stringify(defaultTables));
  }
};

// Mendapatkan data meja dari Local Storage
const fetchTables = () => {
  return JSON.parse(localStorage.getItem("tables"));
};

// Memperbarui status meja di Local Storage
const updateTableStatus = (tableId, status) => {
  const tables = fetchTables();
  const tableIndex = tables.findIndex((table) => table.id === tableId);

  if (tableIndex !== -1) {
    tables[tableIndex].status = status;
    localStorage.setItem("tables", JSON.stringify(tables));

    // Gunakan SweetAlert untuk notifikasi
    Swal.fire({
      title: `Table ${tableId} has been ${status.toLowerCase()}!`,
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      renderTables();
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "Table not found!",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

// Menampilkan daftar meja di halaman
const renderTables = () => {
  const tables = fetchTables();
  const container = document.getElementById("tables");
  container.innerHTML = ""; // Kosongkan elemen sebelumnya

  tables.forEach((table) => {
    const tableDiv = document.createElement("div");
    tableDiv.className = `flex flex-col items-center justify-center p-4 rounded-lg shadow ${
      table.status === "Available"
        ? "bg-table-available text-green-700 bg-[#1d1d1d] hover:bg-green-800 cursor-pointer"
        : "bg-table-booked text-red-700 bg-[#1d1d1d] cursor-not-allowed"
    }`;

    tableDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12M6 16h12M6 8h12" />
      </svg>
      <span>Table ${table.id}</span>
    `;

    if (table.status === "Available") {
      tableDiv.addEventListener("click", () => {
        Swal.fire({
          title: `Do you want to book Table ${table.id}?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            updateTableStatus(table.id, "Booked");
          }
        });
      });
    }

    container.appendChild(tableDiv);
  });
};

// Tampilkan atau sembunyikan slide-in daftar meja
const toggleSlide = (isOpen) => {
  const slide = document.getElementById("table-slide");
  const trigger = document.getElementById("table-trigger");

  slide.classList.toggle("-translate-x-full", !isOpen);
  trigger.classList.toggle("hidden", isOpen);
};

// Event Listener untuk tombol trigger
document.getElementById("table-trigger").addEventListener("click", () => toggleSlide(true));

// Event Listener untuk tombol close
document.getElementById("close-slide").addEventListener("click", () => toggleSlide(false));

// Inisialisasi saat halaman dimuat
initTables();
renderTables();
