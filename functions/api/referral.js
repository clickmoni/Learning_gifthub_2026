alert("Referral.js loaded");
const email =
    localStorage.getItem("currentUser") ||
    localStorage.getItem("clickmoni_email");

if (!email) {
    location.href = "login.html";
}

fetch("https://learning-gifthub-2026.pages.dev/api/me?email=" + encodeURIComponent(email))
.then(res => res.json())
.then(data => {

    if (!data.success) {
        alert("Unable to load referral information.");
        return;
    }

    document.getElementById("refBox").style.display = "block";

    const referralLink =
        window.location.origin +
        "/signup.html?ref=" +
        data.user.referral_code;

    document.getElementById("refLink").textContent = referralLink;

})
.catch(err => {
    console.error(err);
    alert("Failed to load referral link.");
});

function copyRef() {
    navigator.clipboard.writeText(
        document.getElementById("refLink").textContent
    );
    alert("Referral link copied!");
}

function shareWhatsApp() {
    const link = document.getElementById("refLink").textContent;
    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent("Join ClickMoni:\n" + link),
        "_blank"
    );
}

function shareTelegram() {
    const link = document.getElementById("refLink").textContent;
    window.open(
        "https://t.me/share/url?url=" +
        encodeURIComponent(link),
        "_blank"
    );
}
