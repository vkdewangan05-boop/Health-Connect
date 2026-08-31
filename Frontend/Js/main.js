// =====================================================
// SMART HEALTHCARE PLATFORM
// Main JavaScript
// =====================================================


// =====================================================
// PAGE LOADED
// =====================================================

console.log("Smart Healthcare Platform loaded successfully.");


// =====================================================
// NAVBAR ACTIVE LINK
// =====================================================

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

    });

});


// =====================================================
// SCROLL BASED NAVBAR
// =====================================================

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }

    });

});