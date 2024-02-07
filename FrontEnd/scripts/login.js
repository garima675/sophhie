/** retrieve the form **/
const form = document.querySelector("form");

async function onSubmit(event) {
    event.preventDefault();
    
    
    let user ={
        email: form.email.value,
        password: form.password.value,
    };
    console.log("User object:", user);

    let response = await fetch(
        "http://localhost:5678/api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(user),
        }
    );
    

    let result = await response.json();
    

    // **If the credentials are correct***/
    if (response.status === 200) {
        console.log("Login successful");
        sessionStorage.setItem("token", result.token);
        window.location.replace(`index.html`);
    } 
    //** Otherwise, if the credentials are incorrect **/
    else if (response.status === 404 || response.status === 401) {
        console.log("Login failed");
        form.email.value = "";
        form.password.value = "";
        alert("le nom d'utilisateur ou le mot de passe n'est pas bon");
    }
}

