document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://randomuser.me/api/?results=50'; // URL de l'API pour récupérer 50 profils aléatoires
    const searchBar = document.getElementById('search-bar');
    let donators = []; // Tableau pour stocker les informations des donateurs après traitement
    let filteredDonators = []; // Tableau pour stocker les donateurs après filtrage

    const app = document.getElementById('app'); // Référence à l'élément HTML avec l'ID 'app'

    // Fonction pour récupérer les donateurs depuis l'API
    function fetchDonators() {
        fetch(apiUrl) // Effectue une requête GET vers l'API
            .then(response => response.json()) // Transforme la réponse en objet JSON
            .then(data => {
                donators = data.results.map(user => ({
                    name: `${user.name.first} ${user.name.last}`, 
                    city: `${user.location.city}`,
                    country: `${user.location.country}`,
                    phone: user.phone, 
                    gender: user.gender, 
                    amount: Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 100) / 100, // Montant aléatoire avec centimes pour simuler un don
                    picture: user.picture.large 
                }));
                filteredDonators = [...donators]; // Au départ, tous les donateurs sont affichés
                renderDonators(filteredDonators); // Affiche la liste des donateurs
            })
            .catch(error => console.error('Error fetching donators:', error)); // Gère les erreurs de la requête
    }

    // Fonction pour afficher les donateurs dans l'élément 'app'
    function renderDonators(donators) {
        app.innerHTML = '<h1 id="title">LIST OF DONATORS</h1>';
        const donatorGrid = document.createElement('div');
        donatorGrid.classList.add('list-of-donators');
        donators.forEach(donator => { 
            const donatorElement = document.createElement('div'); // Crée un conteneur pour chaque donateur
            donatorElement.classList.add('donator'); // Ajoute une classe CSS 'donator' pour le style
            donatorElement.innerHTML = `
                    <p id="don">${donator.amount}€</p>
                    <img src="${donator.picture}" alt="${donator.name}">
                    <div class="donator-info">
                    <h2>${donator.name}</h2>
                    <p><i class="fa-solid fa-location-dot"></i> ${donator.city}, <a id="country">${donator.country}</a></p>
                    <p><i class="fa-solid fa-phone"></i> ${donator.phone}</p>
                </div>
            `;
            donatorGrid.appendChild(donatorElement); // Ajoute le donateur au conteneur principal
        });
        app.appendChild(donatorGrid); // Ajoute tous les donateurs à la page
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

    fetchDonators(); // Récupère les donateurs au démarrage de la page
});
