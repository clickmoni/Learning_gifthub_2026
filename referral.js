const email =
localStorage.getItem("currentUser") ||
localStorage.getItem("clickmoni_email");

if (!email) {
    window.location.href = "login.html";
}

async function loadReferral() {

    try {

        const response = await fetch(
            "https://learning-gifthub-2026.pages.dev/api/me?email=" +
            encodeURIComponent(email)
        );

        const result = await response.json();

        if (!result.success) {
            alert("Unable to load your referral information.");
            return;
        }

        document.getElementById("refBox").style.display = "block";

        const referralCode = result.user.referral_code;

        const referralLink =
            "https://learning-gifthub-2026.pages.dev/signup.html?ref=" +
            referralCode;

        document.getElementById("refLink").textContent = referralLink;

    } catch (err) {

        console.error(err);
        alert("Unable to connect to the server.");

    }

}

loadReferral();

function copyRef() {

    const link =
    document.getElementById("refLink").textContent;

    navigator.clipboard.writeText(link);

    alert("Referral link copied successfully!");

}

function shareWhatsApp() {

    const link =
    document.getElementById("refLink").textContent;

    const text =
    "Join ClickMoni and earn daily income! 💰\n\n" +
    link;

    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(text),
        "_blank"
    );

}

function shareTelegram() {

    const link =
    document.getElementById("refLink").textContent;

    const text =
    "Join ClickMoni and earn daily income! 💰\n\n" +
    link;

    window.open(
        "https://t.me/share/url?url=" +
        encodeURIComponent(link) +
        "&text=" +
        encodeURIComponent(text),
        "_blank"
    );

        }
