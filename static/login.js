document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("error-message");
    const loginBtn = document.getElementById("login-btn");

    form.addEventListener("submit", handleLogin);

    async function handleLogin(event) {
        event.preventDefault();
        clearError();
        setLoading(true);

        try {
            const formData = new FormData(form);

            const response = await fetch("/auth/login", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            const payload = await safeJson(response);

            if (!response.ok) {
                throw new Error(
                    payload?.detail.message || "Credenciales inválidas o acceso no autorizado"
                );
            }

            // ✅ Login OK
            window.location.href = "/";
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // ---------- Helpers ----------

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.hidden = false;
    }

    function clearError() {
        errorDiv.textContent = "";
        errorDiv.hidden = true;
    }

    function setLoading(isLoading) {
        loginBtn.disabled = isLoading;
        loginBtn.textContent = isLoading ? "LOGGING IN..." : "LOGIN";
    }

    async function safeJson(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }
});
