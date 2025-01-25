// Variables globales
const cart = [];
const productList = document.getElementById('product-list');
const cartDetails = document.getElementById('cart-details');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const rentalDaysInput = document.getElementById('rental-days');
const paymentMethodSelect = document.getElementById('payment-method');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const checkoutButton = document.getElementById('checkout-button');

// Exemple de liste de produits (avec IDs uniques)
const products = [
    {
        id: 1,
        name: "Échafaudage 12pi",
        description: "Facilitons-nous les rénovations avec cet échafaudage de 12 pi à louer pour 50$ CAD le 1er jour et 25$ par jour additionnel. Possibilité de livraison.",
        price: 50.00,
        image: "img/echafaudage12pi.jpg",
    },
    {
        id: 2,
        name: "Échafaudage",
        description: "Facilitons-nous les rénovations avec cet échafaudage. Très pratique et facile à assembler. 25$ CAD le premier jour et 15$ par jour additionnel. Possibilité de livraison.",
        price: 25.00,
        image: "img/echafaudage.jpg",
    },
    {
        id: 3,
        name: "Échafaudage 18 pi",
        description: "Facilitons-nous les rénovations avec cet échafaudage. Très pratique et facile à assembler. 75$ CAD le premier jour et 50$ par jour additionnel. Possibilité de livraison.",
        price: 75.00,
        image: "img/echafaudage18pi.jpg",
    },
    {
        id: 4,
        name: "Sableuse à joint",
        description: "Sableuse à joint à louer pour 25$ le 1er jour et 15$ par jour additionnel.",
        price: 25.00,
        image: "img/sableuseajoint.jpg",
    },
    {
        id: 5,
        name: "Sableuse à plancher",
        description: "Sableuse à plancher à louer pour 50$ le 1er jour et 40$ par jour additionnel.",
        price: 50.00,
        image: "img/sableuseaplancher.jpg",
    },
];

// Fonction pour afficher les produits
function displayProducts() {
    productList.innerHTML = ''; // Nettoyer la liste
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Prix: $${product.price}/jour</p>
            <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        `;
        productList.appendChild(productDiv);
    });

    // Ajouter des événements pour les boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Fonction pour ajouter un produit au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        alert(`${product.name} a été ajouté au panier.`);
    }
}

// Fonction pour mettre à jour le nombre d'articles dans le panier
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Fonction pour afficher les détails du panier
function showCartDetails() {
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    cartDetails.style.display = 'block';
    cartItems.innerHTML = ''; // Vider la liste des articles

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}/jour`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Supprimer';
        removeButton.addEventListener('click', () => {
            removeFromCart(index);
        });
        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });
}

// Fonction pour supprimer un article du panier
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    showCartDetails();
}

// Fonction pour gérer le processus de location et envoyer un email
function handleCheckout() {
    if (!emailInput.value || !phoneInput.value) {
        alert("Veuillez remplir tous les champs requis.");
        return;
    }
    if (!rentalDaysInput.value || rentalDaysInput.value <= 0) {
        alert("Veuillez indiquer une durée de location valide.");
        return;
    }
    if (!paymentMethodSelect.value) {
        alert("Veuillez choisir une méthode de paiement.");
        return;
    }

    const rentalDetails = {
        items: cart,
        rentalDays: rentalDaysInput.value,
        paymentMethod: paymentMethodSelect.value,
        email: emailInput.value,
        phone: phoneInput.value
    };

    console.log("Détails de la réservation :", rentalDetails);

    // Créer un objet avec les informations de la commande
    const formData = {
        user_email: rentalDetails.email,
        user_phone: rentalDetails.phone,
        rental_days: rentalDetails.rentalDays,
        payment_method: rentalDetails.paymentMethod,
        items: rentalDetails.items.map(item => item.name).join(', ')
    };

    // Envoyer l'email via EmailJS
    emailjs.send('service_5pnfnlj', 'template_i82dfx8', formData, 'ueBypAr6n5Ptu1rE0')
        .then(function(response) {
            console.log('Succès:', response);
            alert("Votre commande a été envoyée avec succès !");
            resetCart(); // Réinitialiser le panier uniquement après succès
        })
        .catch(function(error) {
            console.log('Erreur:', error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        });
}

// Fonction pour réinitialiser le panier après la location
function resetCart() {
    cart.length = 0;
    updateCartCount();
    cartDetails.style.display = 'none';
    rentalDaysInput.value = 1;
    emailInput.value = '';
    phoneInput.value = '';
}

// Événements
document.getElementById('cart').addEventListener('click', showCartDetails);
checkoutButton.addEventListener('click', handleCheckout);

// Initialiser la page
displayProducts();
