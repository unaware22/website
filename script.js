// Toggle
const hamburgerBtn = document.getElementById('navbar-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
});



// FIlter Button

// Get filter buttons and menu items
const filterButtons = document.querySelectorAll('.filter-button');
const menuItems = document.querySelectorAll('.menu-item');

// Add event listener to each filter button
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

// Highlight active button
filterButtons.forEach((btn) => btn.classList.remove('bg-yellow-500'));
button.classList.add('bg-yellow-500');

// Show/Hide menu items based on filter
menuItems.forEach((item) => {
if (filter === 'all' || item.getAttribute('data-category') === filter) {
    item.style.display = 'block';
    } else {
    item.style.display = 'none';
    }
  });
});
});



// CART

