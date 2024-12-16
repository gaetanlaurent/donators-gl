document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://randomuser.me/api/?results=100'; // URL de l'API pour récupérer 100 profils aléatoires
    const searchBar = document.getElementById('search-bar');
    let donators = []; // Liste complète des donateurs
    let filteredDonators = []; // Donateurs après recherche ou filtrage
    let currentPage = 1; // Page active
    const donatorsPerPage = 20; // Nombre de donateurs par page

    const app = document.getElementById('app'); // Conteneur principal
    const paginationContainer = document.getElementById('pagination'); // Conteneur pour la pagination

    // Fonction pour récupérer les donateurs depuis l'API
    function fetchDonators() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                donators = data.results.map(user => ({
                    name: `${user.name.first} ${user.name.last}`,
                    city: `${user.location.city}`,
                    country: `${user.location.country}`,
                    phone: user.phone,
                    gender: user.gender,
                    amount: Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 100) / 100, // Montant aléatoire
                    picture: user.picture.large
                }));
                filteredDonators = [...donators]; // Par défaut, tous les donateurs sont affichés
                renderPaginatedDonators(); // Affiche la première page
            })
            .catch(error => console.error('Error fetching donators:', error));
    }

    // Fonction pour afficher les donateurs avec pagination
    function renderPaginatedDonators() {
        const start = (currentPage - 1) * donatorsPerPage;
        const end = currentPage * donatorsPerPage;
        const paginatedDonators = filteredDonators.slice(start, end);

        renderDonators(paginatedDonators); // Affiche les donateurs de la page actuelle
        renderPaginationButtons(); // Met à jour les boutons de pagination
    }

    // Fonction pour afficher les donateurs
    function renderDonators(donators) {
        app.innerHTML = '<h1 id="title">LIST OF DONATORS</h1>';
        const donatorGrid = document.createElement('div');
        donatorGrid.classList.add('list-of-donators');
        donators.forEach(donator => {
            const donatorElement = document.createElement('div');
            donatorElement.classList.add('donator');
            donatorElement.innerHTML = `
                <p id="don">${donator.amount}€</p>
                <img src="${donator.picture}" alt="${donator.name}">
                <div class="donator-info">
                    <h2>${donator.name}</h2>
                    <p><i class="fa-solid fa-location-dot"></i> ${donator.city}, <a id="country">${donator.country}</a></p>
                    <p><i class="fa-solid fa-phone"></i> ${donator.phone}</p>
                </div>
            `;
            donatorGrid.appendChild(donatorElement);
        });
        app.appendChild(donatorGrid);
    }

    // Fonction pour afficher les boutons de pagination
    function renderPaginationButtons() {
        paginationContainer.innerHTML = ''; // Réinitialise la pagination
        const totalPages = Math.ceil(filteredDonators.length / donatorsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;

            // Ajoute une classe "active" au bouton de la page actuelle
            if (i === currentPage) {
                button.classList.add('active');
            }

            // Gère le clic sur un bouton de pagination
            button.addEventListener('click', () => {
                currentPage = i;
                renderPaginatedDonators();
            });

            paginationContainer.appendChild(button);
        }
    }

    // Gestionnaires pour les filtres
    document.getElementById('all-donators').addEventListener('click', () => {
        filteredDonators = [...donators]; // Réinitialise à tous les donateurs
        renderDonators(filteredDonators); // Affiche tous les donateurs
        selectButton('all-donators'); // Applique la sélection au bouton
    });

    document.getElementById('male-donators').addEventListener('click', () => {
        filteredDonators = donators.filter(donator => donator.gender === 'male');
        renderDonators(filteredDonators); // Affiche les donateurs masculins
        selectButton('male-donators'); // Applique la sélection au bouton
    });

    document.getElementById('female-donators').addEventListener('click', () => {
        filteredDonators = donators.filter(donator => donator.gender === 'female');
        renderDonators(filteredDonators); // Affiche les donateurs féminins
        selectButton('female-donators'); // Applique la sélection au bouton
    });

    // Fonction pour trier les donateurs par montant ou alphabétiquement
    function sortDonators(criteria, order) {
        if (criteria === 'amount') {
            filteredDonators.sort((a, b) => order ? b.amount - a.amount : a.amount - b.amount); // Tri par montant
        } else if (criteria === 'alphabetical') {
            filteredDonators.sort((a, b) => order ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)); // Tri alphabétique
        }
        renderDonators(filteredDonators); // Rafraîchit l'affichage après tri
    }

    // Gestionnaires pour les tris
    let amountOrder = true; // true = décroissant, false = croissant
    document.getElementById('sort-amount').addEventListener('click', () => {
        amountOrder = !amountOrder; // Change l'ordre à chaque clic
        sortDonators('amount', amountOrder); // Applique le tri par montant
        selectButton('sort-amount'); // Applique la sélection au bouton de tri
    });

    let alphabeticalOrder = true; // true = croissant, false = décroissant
    document.getElementById('sort-alphabetical').addEventListener('click', () => {
        alphabeticalOrder = !alphabeticalOrder; // Change l'ordre à chaque clic
        sortDonators('alphabetical', alphabeticalOrder); // Applique le tri alphabétique
        selectButton('sort-alphabetical'); // Applique la sélection au bouton de tri
    });

    // Fonction pour gérer la sélection d'un bouton (ajout de la classe 'selected')
    function selectButton(id) {
        const buttons = document.querySelectorAll('aside button');
        buttons.forEach(button => button.classList.remove('selected')); // Retire la sélection de tous les boutons
        document.getElementById(id).classList.add('selected'); // Ajoute la sélection au bouton cliqué
    }

    searchBar.addEventListener('input', () => {
        const searchText = searchBar.value.toLowerCase(); // Convertit la recherche en minuscules
        filteredDonators = donators.filter(donator =>
            donator.name.toLowerCase().includes(searchText) || // Recherche par nom
            donator.city.toLowerCase().includes(searchText) || // Recherche par ville
            donator.country.toLowerCase().includes(searchText) // Recherche par pays
        );
        renderDonators(filteredDonators); // Affiche uniquement les donateurs correspondant à la recherche
    });

    // Gestion des recherches
    searchBar.addEventListener('input', () => {
        const searchText = searchBar.value.toLowerCase();
        filteredDonators = donators.filter(donator =>
            donator.name.toLowerCase().includes(searchText) ||
            donator.city.toLowerCase().includes(searchText) ||
            donator.country.toLowerCase().includes(searchText)
        );
        currentPage = 1; // Réinitialise à la première page après une recherche
        renderPaginatedDonators(); // Affiche les résultats filtrés avec pagination
    });

    fetchDonators(); // Charge les donateurs au démarrage de la page
});