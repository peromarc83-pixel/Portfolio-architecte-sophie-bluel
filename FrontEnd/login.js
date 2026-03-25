// login.js

document.querySelector(".btn-login").addEventListener("click", () => {

    // Récupération des valeurs du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envoi des données à l'API
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            // Mauvais identifiants → on affiche l'erreur
            showError("Identifiants incorrects, veuillez réessayer.");
        }
    })
    .then(data => {
        if (data && data.token) {
            // ✅ Stockage du token pour les futures requêtes
            localStorage.setItem("token", data.token);
            // ✅ Redirection vers la page d'accueil
            window.location.href = "index.html";
        }
    })
    .catch(error => console.log(error));
});

// Fonction d'affichage du message d'erreur
function showError(message) {
    // On évite les doublons si on clique plusieurs fois
    const existing = document.querySelector(".error-message");
    if (existing) existing.remove();

    const error = document.createElement("p");
    error.classList.add("error-message");
    error.innerText = message;

    // Insertion après le champ mot de passe
    const loginForm = document.querySelector(".login-form");
    loginForm.insertBefore(error, document.querySelector(".btn-login"));
}