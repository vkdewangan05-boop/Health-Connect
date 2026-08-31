// ========================================
// HOSPITAL DASHBOARD
// ========================================

const hospitalUser =
    localStorage.getItem("loggedInUser");


// ========================================
// MEDICINE STOCK DATA
// ========================================

const medicines = [

    {
        id: 1,
        name: "Paracetamol",
        category: "Tablet",
        quantity: 500,
        status: "Available"
    },

    {
        id: 2,
        name: "Amoxicillin",
        category: "Capsule",
        quantity: 250,
        status: "Available"
    },

    {
        id: 3,
        name: "Azithromycin",
        category: "Tablet",
        quantity: 80,
        status: "Low Stock"
    },

    {
        id: 4,
        name: "Cetirizine",
        category: "Tablet",
        quantity: 350,
        status: "Available"
    }

];


// ========================================
// LOAD MEDICINE TABLE
// ========================================

const medicineTable =
    document.getElementById("medicineTable");

if (medicineTable) {

    medicines.forEach(medicine => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${medicine.id}</td>

            <td>${medicine.name}</td>

            <td>${medicine.category}</td>

            <td>${medicine.quantity}</td>

            <td>${medicine.status}</td>

        `;

        medicineTable.appendChild(row);

    });

}


// ========================================
// DISPENSING FORM
// ========================================

const dispensingForm =
    document.getElementById("dispensingForm");

if (dispensingForm) {

    dispensingForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const message =
                document.getElementById(
                    "dispensingMessage"
                );

            message.textContent =
                "Medicine dispensed successfully!";

            dispensingForm.reset();

        }
    );

}


// ========================================
// LOGOUT
// ========================================

function logoutHospital() {

    localStorage.removeItem("loggedInUser");

    window.location.href =
        "../login.html";

}