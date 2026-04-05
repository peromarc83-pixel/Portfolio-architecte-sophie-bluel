
/**GALERIE ET FILTRES**/

let allWorks = [];


function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; 

    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}


fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        allWorks = works; 
        displayWorks(allWorks); 
    })
    .catch(error => console.log(error));


fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        const filtersContainer = document.querySelector(".filters");

        
        const btnAll = document.createElement("button");
        btnAll.innerText = "Tous";
        btnAll.classList.add("filter-btn", "active");
        filtersContainer.appendChild(btnAll);

       
        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.innerText = category.name;
            btn.classList.add("filter-btn");
            filtersContainer.appendChild(btn);
        });

       
        const allButtons = document.querySelectorAll(".filter-btn");

        filtersContainer.addEventListener("click", (e) => {
            if (!e.target.classList.contains("filter-btn")) return;

          
            allButtons.forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");

           
            if (e.target.innerText === "Tous") {
                displayWorks(allWorks);
            } else {
                const filtered = allWorks.filter(work => 
                    work.category.name === e.target.innerText
                );
                displayWorks(filtered);
            }
        });
    })
    .catch(error => console.log(error));

// Vérification de la connexion
const token = localStorage.getItem("token");

if (token) {
    activerModeEdition();
}

function activerModeEdition() {

    // 1. BANDEAU "MODE ÉDITION"

  const bandeau = document.createElement("div");
bandeau.classList.add("bandeau-edition");
bandeau.innerHTML = `<img src="./assets/icons/mode edition.png" alt="mode édition"> Mode édition`;
document.body.prepend(bandeau);

    // 2. LOGIN → LOGOUT

    const loginLink = document.querySelector(".login-link");
    loginLink.innerText = "logout";
    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.reload();
    });

    // 3. CACHER LES FILTRES

    document.querySelector(".filters").style.display = "none";

    // 4. BOUTON MODIFIER

    const btnModifier = document.createElement("button");
    btnModifier.classList.add("btn-modifier");
    btnModifier.innerHTML = `<img src="./assets/icons/Group.png" alt="modifier"> modifier`;
    document.querySelector("#portfolio h2").appendChild(btnModifier);

    // ✅ Écouteur ici, juste après la création du bouton

    btnModifier.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        showGalleryView();
        loadModalPhotos();
    });
}

// ── MODALE ──

const overlay = document.getElementById("overlay");
const modalGallery = document.getElementById("modal-gallery");
const modalForm = document.getElementById("modal-form");

// Fermeture via la croix 

document.querySelector(".modal-close").addEventListener("click", closeModal);

// Fermeture via clic sur l'overlay

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
});

// Flèche retour → vue galerie

document.querySelector(".modal-back").addEventListener("click", () => {
    showGalleryView();
});

// Bouton "Ajouter une photo" → vue formulaire

document.querySelector(".btn-add-photo").addEventListener("click", () => {
    showFormView();
    loadCategories();
});

function closeModal() {
    overlay.classList.add("hidden");
    showGalleryView();
}

function showGalleryView() {
    modalGallery.classList.remove("hidden");
    modalForm.classList.add("hidden");
}

function showFormView() {
    modalGallery.classList.add("hidden");
    modalForm.classList.remove("hidden");
}

function loadModalPhotos() {
    const container = document.querySelector(".modal-photos");
    container.innerHTML = "";

    allWorks.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn-delete");
        btnDelete.innerHTML = "🗑️";
        btnDelete.dataset.id = work.id;

        figure.appendChild(img);
        figure.appendChild(btnDelete);
        container.appendChild(figure);
    });
}

function loadCategories() {
    const select = document.getElementById("categorie");
    select.innerHTML = "<option value=''></option>";

    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(categories => {
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.innerText = cat.name;
                select.appendChild(option);
            });
        });
}

document.getElementById("photo-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById("preview-img");
        preview.src = e.target.result;
        preview.classList.remove("hidden");
        document.getElementById("upload-content").classList.add("hidden");
    };
    reader.readAsDataURL(file);
    checkFormValidity();
});

function checkFormValidity() {
    const titre = document.getElementById("titre").value;
    const categorie = document.getElementById("categorie").value;
    const photo = document.getElementById("photo-input").files[0];
    const btnValider = document.getElementById("btn-valider");

    if (titre && categorie && photo) {
        btnValider.disabled = false;
        btnValider.classList.add("active");
    } else {
        btnValider.disabled = true;
        btnValider.classList.remove("active");
    }
}

document.getElementById("titre").addEventListener("input", checkFormValidity);
document.getElementById("categorie").addEventListener("change", checkFormValidity);




// Fonction de suppression d'un travail - ETAPE 7//

function deleteWork(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(response => {
        if (response.ok) {
            // 1. Supprimer de allWorks en mémoire
            allWorks = allWorks.filter(work => work.id !== id);

            // 2. Mettre à jour la galerie principale
            displayWorks(allWorks);

            // 3. Mettre à jour la galerie de la modale
            loadModalPhotos();
        } else {
            console.log("Erreur lors de la suppression");
        }
    })
    .catch(error => console.log(error));
}

function loadModalPhotos() {
    const container = document.querySelector(".modal-photos");
    container.innerHTML = "";

    allWorks.forEach(work => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn-delete");
        btnDelete.innerHTML = "🗑️";
        btnDelete.dataset.id = work.id;

        // ✅ Au clic → on appelle deleteWork avec l'id du travail
        btnDelete.addEventListener("click", () => {
            deleteWork(work.id);
        });

        figure.appendChild(img);
        figure.appendChild(btnDelete);
        container.appendChild(figure);
    });
}

//ETAPE 8.1//

// Gestion de la soumission du formulaire d'ajout
document.getElementById("btn-valider").addEventListener("click", () => {

    const titre    = document.getElementById("titre").value;
    const categorie = document.getElementById("categorie").value;
    const photo    = document.getElementById("photo-input").files[0];

    // ── Vérification que tous les champs sont remplis ──
    if (!titre || !categorie || !photo) {
        showFormError("Veuillez remplir tous les champs.");
        return; // on arrête ici si un champ manque
    }

    // ── Construction du FormData ──
    // FormData est obligatoire car on envoie un fichier image
    // L'API n'accepte pas du JSON pour cet envoi
    const formData = new FormData();
    formData.append("image",      photo);
    formData.append("title",      titre);
    formData.append("category",   categorie);

    // ── Envoi à l'API ──
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            showFormError("Erreur lors de l'envoi. Vérifiez les informations.");
        }
    })
    .then(newWork => {
        if (newWork) {
            // 1. Ajouter le nouveau travail dans allWorks en mémoire
            allWorks.push(newWork);

            // 2. Mettre à jour la galerie principale
            displayWorks(allWorks);

            // 3. Réinitialiser le formulaire
            resetForm();

            // 4. Retourner sur la vue galerie de la modale
            showGalleryView();
            loadModalPhotos();
        }
    })
    .catch(error => console.log(error));
});

// ── Affichage d'un message d'erreur dans le formulaire ──
function showFormError(message) {
    // On évite les doublons
    const existing = document.querySelector(".form-error");
    if (existing) existing.remove();

    const error = document.createElement("p");
    error.classList.add("form-error");
    error.innerText = message;

    // Insertion avant le bouton Valider
    const btnValider = document.getElementById("btn-valider");
    btnValider.parentNode.insertBefore(error, btnValider);
}

// ── Réinitialisation du formulaire après envoi réussi ──
function resetForm() {
    document.getElementById("titre").value      = "";
    document.getElementById("categorie").value  = "";
    document.getElementById("photo-input").value = "";

    // Remettre la zone d'upload dans son état initial
    const preview = document.getElementById("preview-img");
    preview.src   = "";
    preview.classList.add("hidden");
    document.getElementById("upload-content").classList.remove("hidden");

    // Remettre le bouton Valider en état désactivé
    const btnValider = document.getElementById("btn-valider");
    btnValider.disabled = true;
    btnValider.classList.remove("active");

    // Supprimer le message d'erreur s'il existe
    const error = document.querySelector(".form-error");
    if (error) error.remove();
}



