let selectedCategoryId = 0; // by default, display all works

document.addEventListener("DOMContentLoaded", function() {
    // Call the function to fetch and display data from the /works API
    displayWorks();

    // Call the function to display filters
    displayFilters();

    displayAdminMode();
});

function displayWorks() {
    // Fetch data from the API
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            // Iterate through the data and create HTML elements for each image
            const gallery = document.getElementById('gallery');
            // Clear the existing content in the gallery
            gallery.innerHTML = '';
            data.forEach(work1 => {
                // Check if the work belongs to the selected category or if all categories are selected
/**no category is selected */ if (selectedCategoryId === 0 || work1.categoryId === selectedCategoryId) {/**selected category meansclicked  */
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    img.src = work1.imageUrl;
                    img.alt = work1.title;
                    const figcaption = document.createElement('figcaption');
                    figcaption.textContent = work1.title;
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayFilters() {
    // New promise: wait for this function to be executed in full before executing the next one
    return new Promise((resolve) => {
      // Fetch API data
      fetch('http://localhost:5678/api/categories')
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function (data) {
          // Add the "All" category to the API data
          data.unshift({
            id: 0,
            name: "Tous",
          });
          // Get DOM elements for attaching filter buttons
          const portfolio = document.getElementById("portfolio");
          const gallery = document.getElementsByClassName("gallery").item(0);
          // Create the filter buttons container
          const divFilters = document.createElement("div");
          divFilters.setAttribute("id", "container-filters");
          // Create filter buttons based on API data
          for (let category of data) {
            const button = document.createElement("button");
            button.classList.add("button-filter");
            button.textContent = category.name;
            button.id = category.id;
            // Attach filter buttons to the DOM
            divFilters.appendChild(button);
          }
          // Attach the filter buttons container to the DOM
          portfolio.insertBefore(divFilters, gallery);
          // Resolve the promise
          resolve();
        });
    });
}

// Event listener to filter works when clicking on the chosen category
document.addEventListener("click", function(event) {
    if (event.target.matches(".button-filter")) {
        // Call filterWorks with the event object
        filterWorks(event);
    }
});

/**
 * Filter works based on their category
 * @param {Event} event - The event object passed from the event listener
 */
function filterWorks(event) {
    // Update the selected category identifier
    selectedCategoryId = parseInt(event.target.id);
    // Display filtered works
    displayWorks();
}


/* Display admin mode if the token has been correctly stored during login **/
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
    editButtonGallery.addEventListener("click", function (event) {
      clearModal();
      displayModalDeleteWorks();
      displayWorksModal();
    });
  }
}