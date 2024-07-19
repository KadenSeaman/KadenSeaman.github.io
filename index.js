const contactMeCloseButton = document.getElementById("contact-me-close-button");
const contactMeOpenButton = document.getElementById("start-btn");
const contactMe = document.getElementById("contact-me");
const firstNameInput = document.getElementById("name");

contactMeCloseButton.addEventListener("click", (e) => {
    e.preventDefault();
    contactMe.style.display = "none";
})

contactMeOpenButton.addEventListener("click",(e) => {
    e.preventDefault();
    contactMe.style.display = "grid";
    contactMeCloseButton.focus();
    document.activeElement.blur();
})