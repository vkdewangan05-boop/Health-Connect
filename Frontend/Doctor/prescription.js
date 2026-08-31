// =====================================================
// HEALTHCONNECT PRESCRIPTION SYSTEM
// =====================================================

const API = "http://localhost:8080";


// =====================================================
// SELECTED MEDICINES
// =====================================================

let selectedMedicines = [];


// =====================================================
// SEARCH CONTROL
// =====================================================

let searchTimeout = null;

let lastSearchText = "";


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTodayDate();

        loadDoctorData();

        loadPrescriptions();

        setupMedicineSearch();

    }
);


// =====================================================
// SET TODAY'S DATE
// =====================================================

function setTodayDate() {

    const dateInput =
        document.getElementById(
            "prescriptionDate"
        );

    if (!dateInput) {
        return;
    }


    const today = new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;
}


// =====================================================
// LOAD LOGGED-IN DOCTOR
// =====================================================

function loadDoctorData() {

    try {

        const storedDoctor =
            localStorage.getItem(
                "doctor"
            );


        const storedLoggedInDoctor =
            localStorage.getItem(
                "loggedInDoctor"
            );


        const storedUser =
            localStorage.getItem(
                "loggedInUser"
            );


        let doctor = null;


        if (storedDoctor) {

            doctor =
                JSON.parse(
                    storedDoctor
                );

        }

        else if (storedLoggedInDoctor) {

            doctor =
                JSON.parse(
                    storedLoggedInDoctor
                );

        }

        else if (storedUser) {

            doctor =
                JSON.parse(
                    storedUser
                );

        }


        if (!doctor) {

            console.warn(
                "Logged-in doctor data not found."
            );

            return;
        }


        const doctorIdInput =
            document.getElementById(
                "doctorId"
            );


        if (
            doctorIdInput &&
            doctor.id
        ) {

            doctorIdInput.value =
                doctor.id;

        }

    }

    catch (error) {

        console.error(
            "Unable to load doctor:",
            error
        );

    }
}


// =====================================================
// SETUP LIVE MEDICINE SEARCH
// =====================================================

function setupMedicineSearch() {

    const searchInput =
        document.getElementById(
            "medicineSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const value =
                searchInput.value.trim();


            clearTimeout(
                searchTimeout
            );


            // -----------------------------------------
            // EMPTY SEARCH
            // -----------------------------------------

            if (!value) {

                clearSearchResults();

                return;
            }


            // -----------------------------------------
            // AVOID SAME REQUEST
            // -----------------------------------------

            if (
                value.toLowerCase() ===
                lastSearchText.toLowerCase()
            ) {

                return;
            }


            lastSearchText = value;


            // -----------------------------------------
            // SMALL DELAY
            // Prevents API call on every single
            // keyboard event immediately
            // -----------------------------------------

            searchTimeout =
                setTimeout(
                    function () {

                        searchMedicineLive(
                            value
                        );

                    },
                    250
                );

        }
    );


    // -----------------------------------------
    // HIDE DROPDOWN WHEN CLICKING OUTSIDE
    // -----------------------------------------

    document.addEventListener(
        "click",
        function (event) {

            const container =
                document.querySelector(
                    ".medicine-search-container"
                );


            if (
                container &&
                !container.contains(event.target)
            ) {

                clearSearchResults();

            }

        }
    );

}


// =====================================================
// LIVE MEDICINE SEARCH
// =====================================================

async function searchMedicineLive(
    name
) {

    const results =
        document.getElementById(
            "searchResults"
        );


    if (!results) {
        return;
    }


    results.style.display = "block";


    results.innerHTML =
        `<div class="loading">
            Searching medicines...
        </div>`;


    try {

        const response =
            await fetch(
                API +
                "/api/medicines/search?name=" +
                encodeURIComponent(name)
            );


        if (!response.ok) {

            throw new Error(
                "Medicine search failed."
            );

        }


        const medicines =
            await response.json();


        displaySearchResults(
            medicines
        );

    }

    catch (error) {

        console.error(
            "Medicine search error:",
            error
        );


        results.innerHTML =
            `<div class="search-message">
                Unable to search medicines.
            </div>`;

    }

}


// =====================================================
// DISPLAY SEARCH RESULTS
// =====================================================

function displaySearchResults(
    medicines
) {

    const results =
        document.getElementById(
            "searchResults"
        );


    if (!results) {
        return;
    }


    results.innerHTML = "";


    results.style.display =
        "block";


    if (
        !Array.isArray(medicines) ||
        medicines.length === 0
    ) {

        results.innerHTML =
            `<div class="search-message">
                No medicines found.
            </div>`;

        return;
    }


    medicines.forEach(
        function (medicine) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "medicine-result";


            const medicineName =
                medicine.name ||
                "Medicine";


            const genericName =
                medicine.genericName ||
                "";


            const category =
                medicine.category ||
                "";


            div.innerHTML = `

                <strong>
                    ${escapeHTML(
                        medicineName
                    )}
                </strong>

                <small>
                    Medicine ID:
                    ${medicine.id ?? "-"}
                    ${
                        genericName
                        ? " | Generic: " +
                          escapeHTML(genericName)
                        : ""
                    }
                </small>

                ${
                    category
                    ? `
                        <small>
                            Category:
                            ${escapeHTML(category)}
                        </small>
                      `
                    : ""
                }

            `;


            // -----------------------------------------
            // CLICK MEDICINE
            // -----------------------------------------

            div.addEventListener(
                "click",
                function () {

                    selectMedicine(
                        medicine
                    );

                }
            );


            results.appendChild(
                div
            );

        }
    );

}


// =====================================================
// SELECT MEDICINE
// =====================================================

function selectMedicine(
    medicine
) {

    const container =
        document.getElementById(
            "selectedMedicineContainer"
        );


    if (!container) {
        return;
    }


    clearSearchResults();


    const medicineId =
        medicine.id;


    const medicineName =
        medicine.name ||
        "Medicine";


    // -----------------------------------------
    // CHECK DUPLICATE
    // -----------------------------------------

    const alreadyAdded =
        selectedMedicines.some(
            function (item) {

                return (
                    item.medicineId ===
                    medicineId
                );

            }
        );


    if (alreadyAdded) {

        alert(
            "This medicine is already added to the prescription."
        );

        return;
    }


    // -----------------------------------------
    // SHOW DOSAGE FORM
    // -----------------------------------------

    container.innerHTML = `

        <div class="selected-medicine">

            <h3>
                ${escapeHTML(
                    medicineName
                )}
            </h3>


            <p>

                <strong>
                    Medicine ID:
                </strong>

                ${medicineId}

            </p>


            ${
                medicine.genericName
                ? `
                    <p>

                        <strong>
                            Generic Name:
                        </strong>

                        ${escapeHTML(
                            medicine.genericName
                        )}

                    </p>
                  `
                : ""
            }


            ${
                medicine.category
                ? `
                    <p>

                        <strong>
                            Category:
                        </strong>

                        ${escapeHTML(
                            medicine.category
                        )}

                    </p>
                  `
                : ""
            }


            <div class="form-group">

                <label>
                    Dosage
                </label>

                <input
                    type="text"
                    id="medicineDosage"
                    placeholder="Example: 1 tablet">

            </div>


            <div class="form-group">

                <label>
                    Frequency
                </label>

                <input
                    type="text"
                    id="medicineFrequency"
                    placeholder="Example: Twice daily">

            </div>


            <div class="form-group">

                <label>
                    Duration
                </label>

                <input
                    type="text"
                    id="medicineDuration"
                    placeholder="Example: 5 days">

            </div>


            <div class="form-group">

                <label>
                    Instructions
                </label>

                <textarea
                    id="medicineInstructions"
                    placeholder="Example: Take after food"></textarea>

            </div>


            <button
                type="button"
                onclick="addSelectedMedicine()">

                Add Medicine

            </button>


            <button
                type="button"
                class="secondary-btn"
                onclick="cancelMedicineSelection()">

                Cancel

            </button>

        </div>

    `;

}


// =====================================================
// CANCEL MEDICINE SELECTION
// =====================================================

function cancelMedicineSelection() {

    const container =
        document.getElementById(
            "selectedMedicineContainer"
        );


    if (container) {

        container.innerHTML =
            "";

    }

}


// =====================================================
// ADD SELECTED MEDICINE
// =====================================================

function addSelectedMedicine() {

    const searchInput =
        document.getElementById(
            "medicineSearch"
        );


    /*
     * Medicine information is temporarily taken
     * from the selected medicine card.
     *
     * The selected medicine object is stored
     * using data attributes below.
     */

    const medicineHeading =
        document.querySelector(
            "#selectedMedicineContainer .selected-medicine h3"
        );


    if (!medicineHeading) {

        alert(
            "Please select a medicine first."
        );

        return;
    }


    const medicineName =
        medicineHeading.textContent.trim();


    const medicineIdText =
        document.querySelector(
            "#selectedMedicineContainer .selected-medicine p"
        );


    if (!medicineIdText) {
        return;
    }


    const medicineIdMatch =
        medicineIdText.textContent.match(
            /\d+/
        );


    if (!medicineIdMatch) {

        alert(
            "Medicine ID not found."
        );

        return;
    }


    const medicineId =
        Number(
            medicineIdMatch[0]
        );


    const dosage =
        document.getElementById(
            "medicineDosage"
        ).value.trim();


    const frequency =
        document.getElementById(
            "medicineFrequency"
        ).value.trim();


    const duration =
        document.getElementById(
            "medicineDuration"
        ).value.trim();


    const instructions =
        document.getElementById(
            "medicineInstructions"
        ).value.trim();


    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (!dosage) {

        alert(
            "Please enter dosage."
        );

        return;
    }


    if (!frequency) {

        alert(
            "Please enter frequency."
        );

        return;
    }


    if (!duration) {

        alert(
            "Please enter duration."
        );

        return;
    }


    // -----------------------------------------
    // ADD MEDICINE
    // -----------------------------------------

    selectedMedicines.push({

        medicineId:
            medicineId,

        medicineName:
            medicineName,

        dosage:
            dosage,

        frequency:
            frequency,

        duration:
            duration,

        instructions:
            instructions

    });


    renderSelectedMedicines();


    // -----------------------------------------
    // CLEAR SELECTION
    // -----------------------------------------

    cancelMedicineSelection();


    if (searchInput) {

        searchInput.value = "";

    }


    lastSearchText = "";

}


// =====================================================
// DISPLAY SELECTED MEDICINES
// =====================================================

function renderSelectedMedicines() {

    const container =
        document.getElementById(
            "selectedMedicinesList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        selectedMedicines.length === 0
    ) {

        container.innerHTML =
            `<p class="info">
                No medicines added yet.
            </p>`;

        return;
    }


    selectedMedicines.forEach(
        function (medicine, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "medicine-list-item";


            div.innerHTML = `

                <h3>
                    ${escapeHTML(
                        medicine.medicineName
                    )}
                </h3>


                <p>

                    <strong>
                        Medicine ID:
                    </strong>

                    ${medicine.medicineId}

                </p>


                <p>

                    <strong>
                        Dosage:
                    </strong>

                    ${escapeHTML(
                        medicine.dosage
                    )}

                </p>


                <p>

                    <strong>
                        Frequency:
                    </strong>

                    ${escapeHTML(
                        medicine.frequency
                    )}

                </p>


                <p>

                    <strong>
                        Duration:
                    </strong>

                    ${escapeHTML(
                        medicine.duration
                    )}

                </p>


                <p>

                    <strong>
                        Instructions:
                    </strong>

                    ${escapeHTML(
                        medicine.instructions ||
                        "-"
                    )}

                </p>


                <button
                    type="button"
                    class="danger-btn"
                    onclick="removeMedicine(${index})">

                    Remove

                </button>

            `;


            container.appendChild(
                div
            );

        }
    );

}


// =====================================================
// REMOVE MEDICINE
// =====================================================

function removeMedicine(
    index
) {

    if (
        index < 0 ||
        index >= selectedMedicines.length
    ) {

        return;

    }


    selectedMedicines.splice(
        index,
        1
    );


    renderSelectedMedicines();

}


// =====================================================
// CREATE PRESCRIPTION
// =====================================================

async function createPrescription() {

    const userId =
        Number(
            document.getElementById(
                "userId"
            ).value
        );


    const doctorId =
        Number(
            document.getElementById(
                "doctorId"
            ).value
        );


    const consultationId =
        Number(
            document.getElementById(
                "consultationId"
            ).value
        );


    const diagnosis =
        document.getElementById(
            "diagnosis"
        ).value.trim();


    const instructions =
        document.getElementById(
            "instructions"
        ).value.trim();


    const prescriptionDate =
        document.getElementById(
            "prescriptionDate"
        ).value;


    const status =
        document.getElementById(
            "status"
        ).value;


    // =================================================
    // VALIDATION
    // =================================================

    if (!userId) {

        showMessage(
            "Please enter Patient ID.",
            "error"
        );

        return;
    }


    if (!doctorId) {

        showMessage(
            "Doctor ID could not be loaded.",
            "error"
        );

        return;
    }


    if (!consultationId) {

        showMessage(
            "Please enter Consultation ID.",
            "error"
        );

        return;
    }


    if (!diagnosis) {

        showMessage(
            "Please enter diagnosis.",
            "error"
        );

        return;
    }


    if (!prescriptionDate) {

        showMessage(
            "Please select prescription date.",
            "error"
        );

        return;
    }


    if (
        selectedMedicines.length === 0
    ) {

        showMessage(
            "Please add at least one medicine.",
            "error"
        );

        return;
    }


    // =================================================
    // PRESCRIPTION OBJECT
    // =================================================

    const prescription = {

        userId:
            userId,

        doctorId:
            doctorId,

        consultationId:
            consultationId,

        diagnosis:
            diagnosis,

        instructions:
            instructions,

        prescriptionDate:
            prescriptionDate,

        status:
            status

    };


    try {

        showMessage(
            "Creating prescription...",
            "info"
        );


        // =================================================
        // STEP 1: CREATE PRESCRIPTION
        // =================================================

        const response =
            await fetch(
                API +
                "/api/prescriptions",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            prescription
                        )

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Prescription creation failed."
            );

        }


        const createdPrescription =
            await response.json();


        const prescriptionId =
            createdPrescription.id;


        if (!prescriptionId) {

            throw new Error(
                "Prescription ID was not returned."
            );

        }


        // =================================================
        // STEP 2: ADD ALL MEDICINES
        // =================================================

        for (
            const medicine
            of selectedMedicines
        ) {

            const prescriptionMedicine = {

                prescriptionId:
                    prescriptionId,

                medicineId:
                    medicine.medicineId,

                medicineName:
                    medicine.medicineName,

                dosage:
                    medicine.dosage,

                frequency:
                    medicine.frequency,

                duration:
                    medicine.duration,

                instructions:
                    medicine.instructions

            };


            const medicineResponse =
                await fetch(
                    API +
                    "/api/prescription-medicines",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                prescriptionMedicine
                            )

                    }
                );


            if (!medicineResponse.ok) {

                throw new Error(
                    "Prescription created, but one or more medicines could not be added."
                );

            }

        }


        // =================================================
        // SUCCESS
        // =================================================

        showMessage(

            "Prescription created successfully! Prescription ID: " +
            prescriptionId,

            "success"

        );


        alert(
            "Prescription created successfully!\n\nPrescription ID: " +
            prescriptionId
        );


        // =================================================
        // RESET
        // =================================================

        document.getElementById(
            "prescriptionForm"
        ).reset();


        selectedMedicines = [];


        renderSelectedMedicines();


        cancelMedicineSelection();


        const searchInput =
            document.getElementById(
                "medicineSearch"
            );


        if (searchInput) {

            searchInput.value = "";

        }


        lastSearchText = "";


        setTodayDate();


        loadDoctorData();


        loadPrescriptions();

    }

    catch (error) {

        console.error(
            "Prescription creation error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to create prescription.",
            "error"
        );

    }

}


// =====================================================
// LOAD ALL PRESCRIPTIONS
// =====================================================

async function loadPrescriptions() {

    const list =
        document.getElementById(
            "prescriptionList"
        );


    if (!list) {
        return;
    }


    list.innerHTML =
        "<p>Loading prescriptions...</p>";


    try {

        const response =
            await fetch(
                API +
                "/api/prescriptions"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load prescriptions."
            );

        }


        const data =
            await response.json();


        list.innerHTML = "";


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            list.innerHTML =
                "<p>No prescriptions found.</p>";

            return;
        }


        data.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "medicine-list-item";


                div.innerHTML = `

                    <h3>
                        Prescription #${item.id}
                    </h3>


                    <p>

                        <strong>
                            Patient ID:
                        </strong>

                        ${item.userId ?? "-"}

                    </p>


                    <p>

                        <strong>
                            Doctor ID:
                        </strong>

                        ${item.doctorId ?? "-"}

                    </p>


                    <p>

                        <strong>
                            Consultation ID:
                        </strong>

                        ${item.consultationId ?? "-"}

                    </p>


                    <p>

                        <strong>
                            Diagnosis:
                        </strong>

                        ${escapeHTML(
                            item.diagnosis ||
                            "-"
                        )}

                    </p>


                    <p>

                        <strong>
                            Instructions:
                        </strong>

                        ${escapeHTML(
                            item.instructions ||
                            "-"
                        )}

                    </p>


                    <p>

                        <strong>
                            Date:
                        </strong>

                        ${item.prescriptionDate || "-"}

                    </p>


                    <p>

                        <strong>
                            Status:
                        </strong>

                        ${escapeHTML(
                            item.status ||
                            "-"
                        )}

                    </p>

                `;


                list.appendChild(
                    div
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Prescription loading error:",
            error
        );


        list.innerHTML =
            `<p class="error">
                Unable to load prescriptions.
            </p>`;

    }

}


// =====================================================
// CLEAR SEARCH RESULTS
// =====================================================

function clearSearchResults() {

    const results =
        document.getElementById(
            "searchResults"
        );


    if (!results) {
        return;
    }


    results.innerHTML = "";


    results.style.display =
        "none";

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.className =
        "message " +
        type;

}


// =====================================================
// HTML SAFETY
// =====================================================

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}