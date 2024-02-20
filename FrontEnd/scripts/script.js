const apiUrl = "http://localhost:5678/api/works"; 
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
    let filteredWorks ;
        if (categoryName === 'Tous') {
            filteredWorks = worksData;
        } else {
            filteredWorks = worksData.filter(work => work.category.name === categoryName);
        }
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


/**
 * Display admin mode if the token has been correctly stored during login
 */
function displayAdminMode() {
    if (sessionStorage.getItem("token")) {
  
  
      // Display the logout button
      const login = document.querySelector("#login");
      login.textContent = "Log out";
      // Display the black banner
      const adminHeader = `<div class="edit_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i><p>Mode édition</p></div>`;
      const header = document.querySelector("header");
      header.style.marginTop = "6rem";
      header.insertAdjacentHTML("beforebegin", adminHeader);
      // Create the edit button
      const editButtonTemplate = `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>`;
      // Positioning of the edit buttons
      const introSophie = document.querySelector("#introduction h2");
      const galleryTitle = document.querySelector("#portfolio h2");
      galleryTitle.insertAdjacentHTML("afterend", editButtonTemplate);
      // Add "href="#modal"" to the edit button of the gallery
      const editButtonGallery = document.querySelector("#portfolio a");
      editButtonGallery.classList.add("open-modal");
      // Disable the filtering function
      const divFilters = document.getElementById("container-filters");
      divFilters.style.display = "none";
      editButtonGallery.addEventListener("click", function (event) {
        clearModal();
        displayModalDeleteWorks();
        displayWorksModal();
      });
    }
  }

//To prevent duplicated content upon the reopenning of the modal
function clearModal() {
    const modalWrapperDelete = document.querySelector(".modal-wrapper-delete");
    const modalWrapperAdd = document.querySelector(".modal-wrapper-add");
  
    if (modalWrapperDelete) {
      while (modalWrapperDelete.firstChild) {
        modalWrapperDelete.removeChild(modalWrapperDelete.firstChild);
      }
    }
  
    if (modalWrapperAdd) {
      while (modalWrapperAdd.firstChild) {
        modalWrapperAdd.removeChild(modalWrapperAdd.firstChild);
      }
    }
  }


/**
 * Display works in the modal based on API data
 */
async function displayWorksModal() {

  // Use the works data already set instead of fetching from the API
  const data = worksData;

  // Iterate over the filtered works and create cards for each work
  for (let work of data) {
    const gallery = document.getElementById("modal-gallery");
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
  }
}

  
/**
 * Display the modal in works deletion mode
 */
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


/**
 * EVENT: Open the modal when clicking on the edit button
 */
document.addEventListener("click", function (event) {
    if (event.target.matches(".open-modal")) {
      event.stopPropagation();
      modal.showModal();
    }
  });
  
/**
 * EVENT: Close the modal when clicking on the close button or outside the modal
 */
document.addEventListener("click", function (event) {
    if (event.target.matches(".close-modal-button")) {
      modal.close();
    } else if (event.target.matches("#modal")) {
      modal.close();
    }
  });


 /* Display the modal in addition mode*/

function displayModalAddWork() {
  // Get the works deletion modal
  const modalWrapper = document.querySelector(".modal-wrapper-add");
  modalWrapper.style.display = null;
  // Create the container for the navigation  between the two modals
  const modalNav = document.createElement("div");
  modalNav.classList.add("modal-nav");
  // Create the "Go back" button to the previous modal
  const goBackButton = document.createElement("i");
  goBackButton.classList.add("fa-solid", "fa-arrow-left", "go-back-button");
  // Create the modal close button
  const closeModalButton = document.createElement("i");
  closeModalButton.classList.add("fa-solid", "fa-xmark", "close-modal-button");
  // Create the modal title
  const titleModal = document.createElement("h3");
  titleModal.textContent = "Ajout photo";
  // Attach the above elements to the DOM
  modalNav.append(goBackButton, closeModalButton);
  modalWrapper.append(modalNav, titleModal);
  displayFormAddWork();
}

 /** EVENT: Transfer to the work addition modal when clicking on the add photo button**/
 
document.addEventListener("click", function (event) {
  if (event.target.matches(".link-modal-add")) {
    event.preventDefault();
    const modalWrapper = document.querySelector(".modal-wrapper-delete");
    modalWrapper.style.display = "none";
    displayModalAddWork();
  }
});

/**
 * Display the work addition form
 */
function displayFormAddWork() {
  // Get the works deletion modal
  const modalWrapper = document.querySelector(".modal-wrapper-add");
  // Create the form
  const formAddWork = document.createElement("form");
  formAddWork.classList.add("form-add-works");
  // Create the form image container
  const containerFormImg = document.createElement("div");
  containerFormImg.classList.add("container-add-img");
  // Create the file preview
  const imgPreview = document.createElement("img");
  imgPreview.classList.add("img-preview");
  imgPreview.src = "assets/icons/icon-img.png";
  // Create the file label
  const labelAddImgButton = document.createElement("label");
  labelAddImgButton.setAttribute("for", "file");
  labelAddImgButton.classList.add("labelAddImg");
  labelAddImgButton.textContent = "+ Ajouter photo";
  // Create the file input
  const addImgButton = document.createElement("input");
  addImgButton.type = "file";
  addImgButton.setAttribute("id", "file");
  addImgButton.setAttribute("accept", "image/png, image/jpeg");
  addImgButton.classList.add("input-image", "verif-form");
  addImgButton.required = true;
  // Create the file information line
  const infoAddImg = document.createElement("p");
  infoAddImg.classList.add("info-addImg");
  infoAddImg.textContent = "jpg, png: max 4MB";
  // Create the form information container
  const containerFormInfo = document.createElement("div");
  containerFormInfo.classList.add("container-form-info");
  // Create the title label
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "title");
  labelTitle.textContent = "Titre";
  // Create the title input
  let inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("name", "title");
  inputTitle.setAttribute("id", "title");
  inputTitle.classList.add("verif-form");
  inputTitle.required = true;
  // Create the category label
  const labelCategory = document.createElement("label");
  labelCategory.setAttribute("for", "category");
  labelCategory.textContent = "Catégorie";
  // Create the category select
  const selectCategory = document.createElement("select");
  selectCategory.setAttribute("id", "selectCategory");
  selectCategory.classList.add("verif-form");
  selectCategory.required = true;
  // Get category options
  setOptionsSelectForm();
  // Create the submit button
  const validFormLabel = document.createElement("label");
  validFormLabel.getAttribute("for", "js-validForm-btn");
  validFormLabel.classList.add("js-add-works");
  validFormLabel.textContent = "Valider";
  validFormLabel.style.backgroundColor = "#A7A7A7";
  const validForm = document.createElement("input");
  validForm.getAttribute("type", "submit");
  validForm.getAttribute("id", "js-validForm-btn");
  validForm.style.display = "none";
  validFormLabel.appendChild(validForm);

  // Attach the above elements to the DOM
  modalWrapper.appendChild(formAddWork);
  formAddWork.append(containerFormImg, containerFormInfo, validFormLabel);
  containerFormImg.append(
    imgPreview,
    labelAddImgButton,
    addImgButton,
    infoAddImg
  );
  containerFormInfo.append(
    labelTitle,
    inputTitle,
    labelCategory,
    selectCategory
  );
  // Add the verification function to change the button color
  verifForm();
}


/**
 * Check the work addition form for button color change
 */
function verifForm() {
  const formAddWork = document.querySelector(".form-add-works");
  const validForm = document.querySelector(".js-add-works");
  const requiredElements = document.querySelectorAll(".verif-form[required]");
  requiredElements.forEach((element) => {
    element.addEventListener("input", function () {
      if (formAddWork.checkValidity()) {
        validForm.style.backgroundColor = "#1D6154";
        //validForm.disabled = false;
      } else {
        validForm.style.backgroundColor = "#A7A7A7";
      }
    });
  });
}
/**
 * Create options for the category select in the work addition form
 */
function setOptionsSelectForm() {
  fetch('http://localhost:5678/api/categories')
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      data.unshift({
        id: 0,
        name: "",
      });
      for (let category of data) {
        const option = document.createElement("option");
        option.classList.add("cat-option");
        option.setAttribute("id", category.id);
        option.setAttribute("name", category.name);
        option.textContent = category.name;
        const selectCategory = document.getElementById("selectCategory");
        selectCategory.append(option);
      }
    });
}
