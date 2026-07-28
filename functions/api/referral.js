const email =
localStorage.getItem("currentUser") ||
localStorage.getItem("clickmoni_email");

if (!email) {
    location.href = "login.html";
}

async function loadReferral() {

    try {

        const res = await fetch(
            "https://learning-gifthub-2026.pages.dev/api/me?email=" +
            encodeURIComponent(email)
        );

        const data = await res.json();

        if (!data.success) {
            alert("Unable to load referral information.");
            return;
        }

        document.getElementById("refBox").style.display = "block";

        const code =
            data.user.referral_code ||
            data.user.referral ||
            data.user.code;

        document.getElementById("refLink").textContent =
            "https://learning-gifthub-2026.pages.dev/signup.html?ref=" + code;

    } catch (err) {

        console.error(err);
        alert("Server error.");

    }

}

loadReferral();

function copyRef() {

    navigator.clipboard.writeText(
        document.getElementById("refLink").textContent
    );

    alert("Referral link copied!");

}

function shareWhatsApp() {

    const link =
    document.getElementById("refLink").textContent;

    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(
            "Join ClickMoni and earn daily income!\n\n" + link
        ),
        "_blank"
    );

}

function shareTelegram() {

    const link =
    document.getElementById("refLink").textContent;

    window.open(
        "https://t.me/share/url?url=" +
        encodeURIComponent(link),
        "_blank"
    );

              }
