document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login realizado com sucesso') {
            window.location.href = `tasks.html?email=${encodeURIComponent(email)}`;
        } else {
            document.getElementById("errorMessage").textContent = "Credenciais inválidas";
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById("errorMessage").textContent = "Erro ao tentar fazer login. Tente novamente mais tarde.";
    });
});
