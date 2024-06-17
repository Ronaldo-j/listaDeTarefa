document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        document.getElementById("errorMessage").textContent = "As senhas não coincidem";
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Usuário cadastrado com sucesso') {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "index.html";
        } else {
            document.getElementById("errorMessage").textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById("errorMessage").textContent = "Erro ao tentar fazer cadastro. Tente novamente mais tarde.";
    });
});
