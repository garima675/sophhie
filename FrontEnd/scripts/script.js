const apiUrl = "http://localhost:5678/api/works"; // Assuming this is the URL for your API endpoint
let worksData = []; // Array to store the fetched works data

function fetchDataAndDisplay() {
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            worksData = data;
            displayFilters();
            displayWorks();
            displayAdminMode();
            displayModalDeleteWorks();

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayWorks() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Clear existing content

    worksData.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.setAttribute('src', work.imageUrl);
        image.setAttribute('alt', work.title);
        const figCaption = document.createElement('figcaption');
        figCaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figCaption);
        gallery.appendChild(figure);
    });
}

function displayFilters() {
    const categories = ['Tous', ...new Set(worksData.map(work => work.category.name))];
    const containerFilters = document.createElement('div');
    containerFilters.id = 'container-filters';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('button-filter');
        button.textContent = category;
        button.addEventListener('click', filterWorks);
        containerFilters.appendChild(button);
    });

    const portfolio = document.getElementById('portfolio');
    portfolio.insertBefore(containerFilters, portfolio.firstChild);
}

function filterWorks(event) {
    const categoryName = event.target.textContent;
    const filteredWorks = categoryName === 'Tous' ? worksData : worksData.filter(work => work.category.name === categoryName);
    displayFilteredWorks(filteredWorks);
}

function displayFilteredWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Clear existing content

    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.setAttribute('src', work.imageUrl);
        image.setAttribute('alt', work.title);
        const figCaption = document.createElement('figcaption');
        figCaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figCaption);
        gallery.appendChild(figure);
    });
}

// Call the function to fetch data and display initially
fetchDataAndDisplay();


/* Display admin mode after login**/
function displayAdminMode() {
  if (sessionStorage.getItem("token")) {
    
// Display the logout button
    const login = document.querySelector("#login");
    login.textContent = "Log out";
    // Display the black banner on page
    const adminHeader = `<div class="edit_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i><p>Mode édition</p></div>`;
    const header = document.querySelector("header");
    header.style.marginTop = "6rem";
    header.insertAdjacentHTML("beforebegin", adminHeader);
    // Create the edit button
    const editButtonTemplate = `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>`;
    // Positioning of the edit button
    const galleryTitle = document.querySelector("#portfolio h2");
    galleryTitle.insertAdjacentHTML("afterend", editButtonTemplate);
    // Add "href="#modal"" to the edit button of the gallery
    const editButtonGallery = document.querySelector("#portfolio a");
    editButtonGallery.classList.add("open-modal");
    // Disable the filtering function
    editButtonGallery.addEventListener("click", function (event) {
      
      displayModalDeleteWorks();
      displayWorksModal();
      
    });
  }
  }



async function displayWorksModal() {
  const gallery = document.getElementById("modal-gallery");
  
  // Clear existing content
  while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
  }

  // Iterate over worksData array to populate modal gallery
  worksData.forEach(work => {
      let figure = document.createElement("figure");
      figure.classList.add("modal-figure-works");

      let image = document.createElement("img");
      image.setAttribute("crossorigin", "anonymous");
      image.setAttribute("src", work.imageUrl);
      image.alt = work.title;

      let deleteButton = document.createElement("i");
      deleteButton.setAttribute("id", work.id);
      deleteButton.classList.add("fa-solid", "fa-trash-can", "delete-work");

      gallery.append(figure);
      figure.append(deleteButton, image);
  });
}
function displayModalDeleteWorks() {
  // Get the works deletion modal
  const modalWrapper = document.querySelector(".modal-wrapper-delete");
  // Create the container between the two modals
  const modalNav = document.createElement("div");
  modalNav.classList.add("modal-nav");
  // Create the modal close button
  const closeModalButton = document.createElement("i");
  closeModalButton.classList.add("fa-solid", "fa-xmark", "close-modal-button");
  // Create the modal title
  const titleModal = document.createElement("h3");
  titleModal.textContent = "Gallerie Photo";
  // Create the gallery container
  const containerGallery = document.createElement("div");
  containerGallery.setAttribute("id", "modal-gallery");
  // Create the "Add photo" button to switch to the works addition modal
  const addWorkButton = document.createElement("button");
  addWorkButton.classList.add("link-modal-add");
  addWorkButton.textContent = "Ajouter une photo";

  // Attach all the above elements to the DOM
  modalNav.append(closeModalButton);
  modalWrapper.append(modalNav, titleModal, containerGallery, addWorkButton);
}


