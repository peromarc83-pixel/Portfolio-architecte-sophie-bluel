
/**
 * ============================================
 * MAIN.JS - Sophie Bluel - Application complète
 * ============================================
 */



// ═══════════════════════════════════════
// ÉTAPE 1 : GALERIE ET FILTRES
// ═══════════════════════════════════════

// SELECTEURS DOM

const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

// VARIABLES

let allWorks = [];

// AFFICHAGE GALERIE

function displayWorks(works) {

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

// FETCH WORKS

function loadWorks() {

    fetch("http://localhost:5678/api/works")

        .then(response => response.json())

        .then(works => {

            allWorks = works;
            displayWorks(allWorks);

        })

        .catch(error => console.log(error));

}

// FETCH CATEGORIES + FILTRES

function loadFilters() {

    fetch("http://localhost:5678/api/categories")

        .then(response => response.json())

        .then(categories => {

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

        })

        .catch(error => console.log(error));

}

// GESTION FILTRES

filtersContainer.addEventListener("click", (e) => {

    if (!e.target.classList.contains("filter-btn")) return;

    const allButtons = document.querySelectorAll(".filter-btn");

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

// LANCEMENT

loadWorks();
loadFilters();

// ═══════════════════════════════════════
// ÉTAPE 2 : AUTHENTIFICATION ET MODE ÉDITION
// ═══════════════════════════════════════

const token = localStorage.getItem("token");

if (token) {
    activerModeEdition();
}

function activerModeEdition() {

    // BANDEAU EDITION

    const bandeau = document.createElement("div");
    bandeau.classList.add("bandeau-edition");

    bandeau.innerHTML =
        `<img src="./assets/icons/mode edition.png"> Mode édition`;

    document.body.prepend(bandeau);


    // LOGIN → LOGOUT

    const loginLink = document.querySelector(".login-link");

    loginLink.innerText = "logout";

    loginLink.addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.reload();

    });


    // CACHER FILTRES

    filtersContainer.style.display = "none";


    // BOUTON MODIFIER

    const btnModifier = document.createElement("button");

    btnModifier.classList.add("btn-modifier");

    btnModifier.innerHTML =
        `<img src="./assets/icons/Group.png"> modifier`;

    document.querySelector("#portfolio h2").appendChild(btnModifier);


    btnModifier.addEventListener("click", () => {

        overlay.classList.remove("hidden");

        showGalleryView();

        loadModalPhotos();

    });

}


// ═══════════════════════════════════════
// ÉTAPE 3 : MODALE - STRUCTURE
// ═══════════════════════════════════════

const overlay = document.getElementById("overlay");
const modalGallery = document.getElementById("modal-gallery");
const modalForm = document.getElementById("modal-form");

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


// EVENT LISTENERS MODALE

document.querySelector(".modal-close").addEventListener("click", closeModal);

document.querySelector(".modal-back").addEventListener("click", showGalleryView);

document.querySelector(".btn-add-photo").addEventListener("click", () => {

    showFormView();

    loadCategories();

});

overlay.addEventListener("click", (e) => {

    if (e.target === overlay) closeModal();

});


// ═══════════════════════════════════════
// ÉTAPE 4 : MODALE - GALERIE
// ═══════════════════════════════════════

function loadModalPhotos() {

    const container = document.querySelector(".modal-photos");

    container.innerHTML = "";

    allWorks.forEach(work => {

        const figure = document.createElement("figure");

        const img = document.createElement("img");

        img.src = work.imageUrl;

        const btnDelete = document.createElement("button");

        btnDelete.classList.add("btn-delete");

        btnDelete.innerHTML = "🗑️";

        btnDelete.dataset.id = work.id;

        figure.appendChild(img);

        figure.appendChild(btnDelete);

        container.appendChild(figure);

        btnDelete.addEventListener("click", () => {

            deleteWork(work.id);

        });

    });

}


// ═══════════════════════════════════════
// ÉTAPE 5 : SUPPRESSION WORK
// ═══════════════════════════════════════

function deleteWork(id) {

    fetch(`http://localhost:5678/api/works/${id}`, {

        method: "DELETE",

        headers: {

            "Authorization": "Bearer " + token

        }

    })

    .then(response => {

        if (response.ok) {

            allWorks = allWorks.filter(work => work.id !== id);

            displayWorks(allWorks);

            loadModalPhotos();

        }

    });

}


/// ═══════════════════════════════════════
// ÉTAPE 6 : MODALE - AJOUT D'UNE PHOTO
// ═══════════════════════════════════════


// CHARGEMENT DES CATEGORIES

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


// VALIDATION DU FORMULAIRE

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


// PREVIEW IMAGE

document.getElementById("photo-input").addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {

        const preview = document.getElementById("preview-img");

        preview.src = event.target.result;

        preview.classList.remove("hidden");

        document
            .getElementById("upload-content")
            .classList.add("hidden");

    };

    reader.readAsDataURL(file);

    checkFormValidity();

});


// EVENT LISTENERS FORMULAIRE

document
    .getElementById("titre")
    .addEventListener("input", checkFormValidity);

document
    .getElementById("categorie")
    .addEventListener("change", checkFormValidity);


// GESTION ERREUR FORMULAIRE

function showFormError(message) {

    const existing = document.querySelector(".form-error");

    if (existing) existing.remove();

    const error = document.createElement("p");

    error.classList.add("form-error");

    error.innerText = message;

    const btnValider = document.getElementById("btn-valider");

    btnValider.parentNode.insertBefore(error, btnValider);

}


// RESET FORMULAIRE

function resetForm() {

    document.getElementById("titre").value = "";

    document.getElementById("categorie").value = "";

    document.getElementById("photo-input").value = "";

    const preview = document.getElementById("preview-img");

    preview.src = "";

    preview.classList.add("hidden");

    document
        .getElementById("upload-content")
        .classList.remove("hidden");


    const btnValider = document.getElementById("btn-valider");

    btnValider.disabled = true;

    btnValider.classList.remove("active");


    const error = document.querySelector(".form-error");

    if (error) error.remove();

}


// ENVOI DU FORMULAIRE

document
    .getElementById("btn-valider")
    .addEventListener("click", () => {

        const titre = document.getElementById("titre").value;

        const categorie = document.getElementById("categorie").value;

        const photo =
            document.getElementById("photo-input").files[0];


        if (!titre || !categorie || !photo) {

            showFormError("Veuillez remplir tous les champs.");

            return;

        }


        const formData = new FormData();

        formData.append("image", photo);

        formData.append("title", titre);

        formData.append("category", categorie);


        fetch("http://localhost:5678/api/works", {

            method: "POST",

            headers: {

                "Authorization": "Bearer " + token

            },

            body: formData

        })

        .then(response => {

            if (response.ok) {

                return response.json();

            } else {

                showFormError(
                    "Erreur lors de l'envoi. Vérifiez les informations."
                );

            }

        })

        .then(newWork => {

            if (newWork) {

                allWorks.push(newWork);

                displayWorks(allWorks);

                resetForm();

                showGalleryView();

                loadModalPhotos();

            }

        })

        .catch(error => console.log(error));

});

