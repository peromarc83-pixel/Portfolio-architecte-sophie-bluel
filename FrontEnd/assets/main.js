
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