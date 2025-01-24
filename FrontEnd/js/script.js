// Fonction pour charger et afficher les filtres 
async function chargerFiltres() {
    const filtresContainer = document.querySelector(".filtres");

    const reponse = await fetch("http://localhost:5678/api/categories");
    const filtres = await reponse.json();

    //Gestion des filtres et création du bouton 'Tous'
    const filtreIds = filtres.map(filtre => filtre.id);

    const btnTous = document.createElement('button');
    btnTous.classList.add('btn-filtrer' , "active");
    btnTous.dataset.categoryId = "0";
    btnTous.textContent = "Tous";
    filtresContainer.appendChild(btnTous);

    // Utilisation d'une boucle for classique pour ajouter les filtres
    for (let i = 0; i < filtreIds.length ; i++) {

        const id = filtreIds[i]; 
        const filtre = filtres.find(f => f.id === id);

        const btnFiltre = document.createElement('button');
        btnFiltre.classList.add('btn-filtrer');
        btnFiltre.dataset.categoryId = filtre.id;
        btnFiltre.textContent = filtre.name;

        filtresContainer.appendChild(btnFiltre);

    
        btnFiltre.addEventListener('click', () => {
            filtrerWorks(filtre.id);
        });


        
    }

    btnTous.addEventListener('click', () => {
        filtrerWorks(); 
    });
}

// Fonction pour filtrer les projets
async function filtrerWorks(categoryId) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; 

    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();

    // Filtrer les projets en fonction de la catégorie
    const filteredWorks = categoryId ? works.filter(work => work.categoryId === categoryId) : works;

    // Créer un contenu HTML pour chaque projet filtré et l'ajouter à la galerie
    for (let i = 0; i < filteredWorks.length; i++) {
        const work = filteredWorks[i];

        const figure = document.createElement('figure');
        figure.dataset.categoryId = work.categoryId;
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const caption = document.createElement('figcaption');
        caption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    }
}
chargerFiltres();
filtrerWorks();

//Gestion du mode édition et de la connexion utilisateur
function editpage() {  

    const editMode = document.getElementById('editMode');
    const connexion = document.getElementById('connexion');
    const filtres = document.querySelector(".filtres");
    const token = localStorage.getItem('token'); 

    if (token) {
       
        if (editMode) {
            editMode.style.display = 'block'; 
        }

        if (connexion) {
            connexion.textContent = 'logout'; 
            connexion.href = '#'; 
        }

        if (filtres) {
            filtres.style.display = 'none'; 
        }

         if (connexion) {
            connexion.addEventListener('click', () => {
                localStorage.removeItem('token'); 
                window.location.href = 'index.html'; 
            });
        }

    } else {
        console.log("Aucun token trouvé. Veuillez vous connecter.");
    }

};
editpage();

//Gestion de l'affichage du bouton d'édition en fonction de l'authentification
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('editGalleryButton'); 
    const token = localStorage.getItem('token'); 

    if (token) {
    
        editButton.style.display = 'block';
    } else {
    
        editButton.style.display = 'none';
    }
})

//Gestion des modales 
document.addEventListener('DOMContentLoaded', () => {
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryModal = document.getElementById('closeGalleryModal');
    const addPhotoModal = document.getElementById('addPhotoModal');
    const closeAddPhotoModal = document.getElementById('closeAddPhotoModal');
    const galleryContainer = document.getElementById('galleryContainer');
    const addPhotoButton = document.getElementById('addPhotoButton');
    const addPhotoForm = document.getElementById('addPhotoForm');
    const photoCategory = document.getElementById('photoCategory');
    const photoFile = document.getElementById('photoFile');
    const photoTitle = document.getElementById('photoTitle');
    const validatePhotoButton = document.getElementById('validatePhotoButton');
    const imgPreview = document.getElementById('img-preview');
    const defaultPlaceholder = document.getElementById('default-placeholder');
    const backButton = document.getElementById('backButton');
    
    document.getElementById('editGalleryButton').addEventListener('click', () => {
      galleryModal.classList.add('show');
      loadGallery();
    });
  
    // Fermer la modale galerie
    closeGalleryModal.addEventListener('click', () => {
      galleryModal.classList.remove('show');
    });
  
    // Ouvrir la modale d'ajout de photo
    addPhotoButton.addEventListener('click', async () => {
      await loadCategories();
      addPhotoModal.classList.add('show');
    });
  
    // Fermer tous les modals
   function closeAllModals() {
    galleryModal.classList.remove('show'); 
    addPhotoModal.classList.remove('show'); 
    document.body.classList.remove('modal-open'); 
}
    closeAddPhotoModal.addEventListener('click', closeAllModals); 

    // Charger les projets dans la modale 
    async function loadGallery() {
      galleryContainer.innerHTML = '';
      try{
      const response = await fetch('http://localhost:5678/api/works');
      const works = await response.json();
  
      works.forEach((work) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
  
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
  
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.addEventListener('click', async () => {
          await deletePhoto(work.id);
          await filtrerWorks(); 
        });

        item.appendChild(img);
        item.appendChild(deleteButton);
        galleryContainer.appendChild(item);
      });
      
    } catch (error) {
      console.error("Erreur lors du chargement de la galerie :", error);
  }
}
  
// Supprimer un projet
    
    async function deletePhoto(id) {
      if (confirm) {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
  
        if (response.ok) {

          console.log('Photo supprimée');
            await filtrerWorks(); 
            closeAllModals(); 
            
          loadGallery();
          
        } else {
         // alert('Erreur lors de la suppression');
        }
      }
    }

     // Charger les catégories pour le formulaire d'ajout
    async function loadCategories() {
      const response = await fetch('http://localhost:5678/api/categories');
      const categories = await response.json();
      photoCategory.innerHTML = '<option value="" disabled selected>Choisir une catégorie</option>';
      categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        photoCategory.appendChild(option);
      });
    }

// Gestion du bouton "Retour" dans la modale d'ajout de photo
backButton.addEventListener('click', () => {
    resetAddPhotoForm();
    document.getElementById('addPhotoModal').classList.remove('show');
    document.getElementById('galleryModal').classList.add('show');
});
    // Gestion de l'aperçu d'image lors de la sélection d'un fichier 
    photoFile.addEventListener('change', () => {
        const file = photoFile.files[0]; 
      
        if (file) {
          imgPreview.src = URL.createObjectURL(file); 
          imgPreview.style.display = 'block'; 
      
          defaultPlaceholder.style.display = 'none';
        } else {
          
          imgPreview.style.display = 'none';
          defaultPlaceholder.style.display = 'block';
        }
      });

// Validation du formulaire d'ajout de photo
    addPhotoForm.addEventListener('input', () => {
      validatePhotoButton.disabled = !(
        photoFile.files.length > 0 &&
        photoTitle.value.trim() &&
        photoCategory.value
      );
    });

     // Gestion du formulaire d'ajout de photo
    addPhotoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
      
        const formData = new FormData();
        formData.append('image', document.getElementById('photoFile').files[0]); 
        formData.append('title', document.getElementById('photoTitle').value); 
        formData.append('category', document.getElementById('photoCategory').value); 
      
        try {
          const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          });
      
          if (response.ok) {
            console.log('Photo ajoutée');
            await filtrerWorks(); 
            closeAllModals(); 

          } else {
            console.error('Erreur lors de l\'ajout');
          }
        } catch (error) {
          console.error('Erreur réseau :', error);
         
        }
      });

      // réinitialiser le formulaire d'ajout de photo
      function resetAddPhotoForm() {
        addPhotoForm.reset();
        imgPreview.style.display = 'none';
        document.getElementById('default-placeholder').style.display = 'block'; 
      }
    
  });




































