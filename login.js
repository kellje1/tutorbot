document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.text();
    alert(data);

    if(data === "User logged in successfully!") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "/index.html";
    }
});