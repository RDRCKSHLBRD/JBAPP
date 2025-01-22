document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-password");
  const passwordInput = document.getElementById("password");

  if (submitButton && passwordInput) {
      submitButton.addEventListener("click", async () => {
          const password = passwordInput.value;

          try {
              const response = await fetch("/login", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ password }),
              });

              const data = await response.json();

              if (response.ok) {
                  window.location.href = data.redirect;
              } else {
                  alert(data.error);
              }
          } catch (error) {
              console.error("Error:", error);
              alert("An error occurred during login");
          }
      });
  }
});