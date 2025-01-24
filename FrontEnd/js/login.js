
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const errorMessageDiv = document.createElement("div"); 
    errorMessageDiv.id = "errorMessage";
    errorMessageDiv.style.color = "red";
    errorMessageDiv.style.marginTop = "10px";
    errorMessageDiv.style.display = "none"; 
   
    // Gérer la soumission du formulaire

    const submitButton = loginForm.querySelector('button[type="submit"]');
    loginForm.insertBefore(errorMessageDiv, submitButton);






loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); 

        // Récupérer les valeurs des champs email et mot de passe
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
              // Réinitialise les styles et messages d'erreur
              emailInput.style.border = "";
              passwordInput.style.border = "";
              errorMessageDiv.style.display = "none";

            // Envoi de la requête POST à l'API de connexion
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // Vérifier la réponse
            if (!response.ok) {
                const errorData = await response.json();
                emailInput.style.border = "1px solid red";
               passwordInput.style.border = "1px solid red";
            
            // Affiche le message d'erreur
                    errorMessageDiv.textContent = "Votre e-mail ou mot de passe est incorrect.";
                    errorMessageDiv.style.display = "block";

                throw new Error(errorData.message || 'Utilisateur introuvable');
            }

            // Récupérer le token
            const data = await response.json();
            const token = data.token; 

            localStorage.setItem('token', token);
              // Redirection après la connexion 
              window.location.href = 'index.html';

        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    })}
);






