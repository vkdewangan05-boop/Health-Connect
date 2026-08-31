// =====================================================
// HEALTHCONNECT PATIENT CONSULTATION
// =====================================================

const API_URL = "http://localhost:8080";

// =====================================================
// GET AUTH TOKEN
// =====================================================

function hcGetAuthToken() {
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            const role = String(user.role || "USER").trim().toUpperCase();

            if (role === "USER") {
                const token = user.token || user.jwt || user.accessToken || user.authToken || user.jwtToken;
                if (token && String(token).trim() !== "") {
                    return String(token).trim();
                }
            }
        } catch (error) {
            console.error("Patient authentication data error:", error);
        }
    }

    const patientToken = localStorage.getItem("patientToken");
    if (patientToken && patientToken.trim() !== "") {
        return patientToken.trim();
    }

    const tokenKeys = ["token", "jwt", "accessToken", "authToken", "jwtToken"];
    for (const key of tokenKeys) {
        const token = localStorage.getItem(key);
        if (token && token.trim() !== "") {
            return token.trim();
        }
    }

    return null;
}

// =====================================================
// AUTHENTICATED FETCH
// =====================================================

async function hcAuthenticatedFetch(url, options = {}) {
    const token = hcGetAuthToken();

    if (!token) {
        throw new Error("Patient JWT token not found. Please login again.");
    }

    const requestOptions = { ...options };

    requestOptions.headers = {
        ...(options.headers || {}),
        "Authorization": "Bearer " + token
    };

    if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
        requestOptions.headers["Content-Type"] = "application/json";
    }

    console.log("Consultation API:", url);
    console.log("Patient JWT present:", !!token);

    const response = await fetch(url, requestOptions);

    if (response.status === 401) {
        throw new Error("Patient authentication failed. Please logout and login again.");
    }

    if (response.status === 403) {
        throw new Error("Patient account is not authorized for this operation.");
    }

    return response;
}

// =====================================================
// LOGGED-IN PATIENT
// =====================================================

const storedUser = localStorage.getItem("loggedInUser");
let loggedInUser = null;

if (storedUser) {
    try {
        loggedInUser = JSON.parse(storedUser);
    } catch (error) {
        console.error("Unable to read logged-in user:", error);
        loggedInUser = null;
    }
}

// =====================================================
// GET VERIFIED PATIENT ID
// =====================================================

function getVerifiedPatientId() {
    if (!loggedInUser) {
        return null;
    }

    const patientId = loggedInUser.id;
    if (patientId === null || patientId === undefined || patientId === "") {
        return null;
    }

    const numericPatientId = Number(patientId);
    if (!Number.isInteger(numericPatientId) || numericPatientId <= 0) {
        return null;
    }

    return numericPatientId;
}

const verifiedPatientId = getVerifiedPatientId();

// =====================================================
// LOGIN CHECK
// =====================================================

if (!verifiedPatientId) {
    alert("Your patient login session is invalid. Please login again.");
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login.html";
}

// =====================================================
// HEALTHCARE TYPE
// =====================================================

let selectedHealthcareType = null;

// =====================================================
// SHOW PATIENT INFORMATION
// =====================================================

function showPatientInformation() {
    const patientInfo = document.getElementById("patientInfo");
    if (!patientInfo || !loggedInUser) {
        return;
    }

    const patientName = loggedInUser.fullName || loggedInUser.username || "Patient";
    patientInfo.textContent = "Patient: " + patientName + " | User ID: " + (loggedInUser.id || "N/A");
}

// =====================================================
// SELECT HEALTHCARE TYPE
// =====================================================

function selectHealthcareType(healthcareType) {
    healthcareType = String(healthcareType).trim().toUpperCase();

    if (healthcareType !== "GOVERNMENT" && healthcareType !== "PRIVATE") {
        return;
    }

    selectedHealthcareType = healthcareType;

    const choiceSection = document.getElementById("healthcareChoiceSection");
    const doctorSection = document.getElementById("doctorSection");
    const selectedText = document.getElementById("selectedHealthcareText");
    const doctorTitle = document.getElementById("doctorSectionTitle");
    const locationInput = document.getElementById("locationSearch");
    const locationMessage = document.getElementById("locationMessage");

    if (choiceSection) choiceSection.style.display = "none";
    if (doctorSection) doctorSection.style.display = "block";

    if (healthcareType === "GOVERNMENT") {
        if (doctorTitle) doctorTitle.textContent = "Available Government Doctors";
        if (selectedText) selectedText.textContent = "Healthcare Type: Government";
    } else {
        if (doctorTitle) doctorTitle.textContent = "Available Private Doctors";
        if (selectedText) selectedText.textContent = "Healthcare Type: Private";
    }

    if (locationInput) locationInput.value = "";

    if (locationMessage) {
        locationMessage.textContent = "Enter a location to find doctors nearby.";
        locationMessage.style.color = "#374151";
    }

    const doctorContainer = document.getElementById("doctorContainer");
    if (doctorContainer) {
        doctorContainer.innerHTML = `
            <div class="dashboard-card">
                <h3>Choose Your Location</h3>
                <p>Enter your preferred city or location above to find doctors.</p>
            </div>
        `;
    }
}

// =====================================================
// CHANGE HEALTHCARE TYPE
// =====================================================

function changeHealthcareType() {
    const choiceSection = document.getElementById("healthcareChoiceSection");
    const doctorSection = document.getElementById("doctorSection");
    const doctorContainer = document.getElementById("doctorContainer");
    const message = document.getElementById("message");
    const locationInput = document.getElementById("locationSearch");
    const locationMessage = document.getElementById("locationMessage");

    selectedHealthcareType = null;

    if (doctorSection) doctorSection.style.display = "none";
    if (choiceSection) choiceSection.style.display = "block";
    if (locationInput) locationInput.value = "";
    if (locationMessage) locationMessage.textContent = "";

    if (doctorContainer) {
        doctorContainer.innerHTML = "<p>Please choose a healthcare type.</p>";
    }

    if (message) message.textContent = "";
}

// =====================================================
// SEARCH DOCTORS BY LOCATION
// =====================================================

async function searchDoctorsByLocation() {
    if (!selectedHealthcareType) {
        alert("Please choose Government or Private healthcare first.");
        return;
    }

    const locationInput = document.getElementById("locationSearch");
    const container = document.getElementById("doctorContainer");
    const locationMessage = document.getElementById("locationMessage");

    if (!container) return;

    const location = locationInput ? locationInput.value.trim().replace(/\s+/g, " ") : "";

    if (!location) {
        if (locationMessage) {
            locationMessage.textContent = "Please enter a location.";
            locationMessage.style.color = "#dc2626";
        }
        return;
    }

    container.innerHTML = "<p>Searching doctors...</p>";

    if (locationMessage) {
        locationMessage.textContent = "Searching doctors in " + location + "...";
        locationMessage.style.color = "#2563eb";
    }

    try {
        const response = await hcAuthenticatedFetch(
            API_URL + "/api/doctors/type/" + encodeURIComponent(selectedHealthcareType) + "/location/" + encodeURIComponent(location)
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Unable to load doctors.");
        }

        let doctors = [];
        try {
            doctors = JSON.parse(responseText);
        } catch (error) {
            doctors = [];
        }

        if (!Array.isArray(doctors) || doctors.length === 0) {
            container.innerHTML = `
                <div class="dashboard-card">
                    <h3>No Doctors Available</h3>
                    <p>No available doctors were found for the selected healthcare type and location.</p>
                </div>
            `;
            return;
        }

        displayDoctors(doctors);

    } catch (error) {
        console.error("Doctor Location Search Error:", error);
        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Unable to Load Doctors</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

// =====================================================
// LOAD ALL DOCTORS
// =====================================================

async function loadAllDoctorsForType() {
    if (!selectedHealthcareType) {
        alert("Please choose Government or Private healthcare first.");
        return;
    }

    const container = document.getElementById("doctorContainer");
    const locationMessage = document.getElementById("locationMessage");

    if (!container) return;

    container.innerHTML = "<p>Loading available doctors from all locations...</p>";

    if (locationMessage) {
        locationMessage.textContent = "Showing all available doctors.";
        locationMessage.style.color = "#2563eb";
    }

    try {
        const response = await hcAuthenticatedFetch(
            API_URL + "/api/doctors/available/" + encodeURIComponent(selectedHealthcareType)
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Unable to load doctors.");
        }

        let doctors = [];
        try {
            doctors = JSON.parse(responseText);
        } catch (error) {
            doctors = [];
        }

        if (!Array.isArray(doctors) || doctors.length === 0) {
            container.innerHTML = `
                <div class="dashboard-card">
                    <h3>No Available Doctors</h3>
                    <p>No available doctors are currently registered for this healthcare type.</p>
                </div>
            `;
            return;
        }

        displayDoctors(doctors);

    } catch (error) {
        console.error("All Doctors API Error:", error);
        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Unable to Load Doctors</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

function loadAllDoctors() {
    return loadAllDoctorsForType();
}

// =====================================================
// DISPLAY DOCTORS
// =====================================================

function displayDoctors(doctors) {
    const container = document.getElementById("doctorContainer");
    if (!container) return;

    container.innerHTML = "";

    doctors.forEach(function(doctor) {
        const card = document.createElement("div");
        card.className = "dashboard-card";

        const doctorType = doctor.doctorType ? doctor.doctorType.toString().trim().toUpperCase() : "N/A";
        let doctorTypeText = doctorType;

        if (doctorType === "GOVERNMENT") {
            doctorTypeText = "Government";
        } else if (doctorType === "PRIVATE") {
            doctorTypeText = "Private";
        }

        const isAvailable = doctor.available === true;
        const availabilityText = isAvailable ? "Available" : "Not Available";

        let feeText;
        if (doctor.consultationFee === null || doctor.consultationFee === undefined) {
            feeText = "N/A";
        } else if (Number(doctor.consultationFee) === 0) {
            feeText = "Free";
        } else {
            feeText = "₹" + doctor.consultationFee;
        }

        const doctorLocation = doctor.location || "N/A";

        card.innerHTML = `
            <h3>👨‍⚕️ ${escapeHTML(doctor.fullName || "Doctor")}</h3>
            <p><strong>Doctor ID:</strong> ${doctor.id ?? "N/A"}</p>
            <p><strong>Specialization:</strong> ${escapeHTML(doctor.specialization || "N/A")}</p>
            <p><strong>Qualification:</strong> ${escapeHTML(doctor.qualification || "N/A")}</p>
            <p><strong>Experience:</strong> ${doctor.experience ?? 0} years</p>
            <p><strong>Location:</strong> ${escapeHTML(doctorLocation)}</p>
            <p><strong>Hospital:</strong> ${escapeHTML(doctor.hospitalName || "N/A")}</p>
            <p><strong>Hospital Address:</strong> ${escapeHTML(doctor.hospitalAddress || "N/A")}</p>
            <p><strong>Healthcare Type:</strong> ${doctorTypeText}</p>
            <p><strong>Consultation Fee:</strong> ${feeText}</p>
            <p><strong>Status:</strong> ${availabilityText}</p>
            ${isAvailable ? `
                <button type="button" class="dashboard-btn" onclick="bookConsultation(${doctor.id}, '${escapeQuotes(doctor.fullName || "Doctor")}')">
                    Request Consultation
                </button>
            ` : ""}
        `;

        container.appendChild(card);
    });
}

// =====================================================
// BOOK CONSULTATION
// =====================================================

async function bookConsultation(doctorId, doctorName) {
    if (!loggedInUser) {
        alert("Please login first.");
        return;
    }

    const patientId = getVerifiedPatientId();
    if (!patientId) {
        alert("Patient ID could not be verified. Please login again.");
        return;
    }

    if (!doctorId) {
        alert("Doctor ID is missing.");
        return;
    }

    const reason = prompt("Enter reason for consultation:");
    if (reason === null) return;

    if (reason.trim() === "") {
        alert("Consultation reason is required.");
        return;
    }

    const consultation = {
        patientId: patientId,
        doctorId: Number(doctorId),
        reason: reason.trim()
    };

    try {
        const response = await hcAuthenticatedFetch(
            API_URL + "/api/consultations",
            {
                method: "POST",
                body: JSON.stringify(consultation)
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Consultation booking failed.");
        }

        let result = null;
        try {
            result = JSON.parse(responseText);
        } catch (error) {
            result = null;
        }

        const message = document.getElementById("message");
        if (message) {
            message.textContent = "Consultation request sent successfully to " + doctorName + "." +
                (result && result.id ? " Consultation ID: " + result.id : "");
            message.style.color = "#16a34a";
        }

        alert(
            "Consultation request sent successfully!\n\n" +
            "Doctor: " + doctorName +
            (result && result.id ? "\nConsultation ID: " + result.id : "")
        );

        await loadConsultations();

    } catch (error) {
        console.error("Consultation Booking Error:", error);

        const message = document.getElementById("message");
        if (message) {
            message.textContent = "Unable to send consultation request: " + error.message;
            message.style.color = "#dc2626";
        }

        alert("Unable to send consultation request.\n\n" + error.message);
    }
}

// =====================================================
// LOAD PATIENT CONSULTATIONS
// =====================================================

async function loadConsultations() {
    // Check both container IDs to prevent loading stuck issue
    const container = document.getElementById("consultationContainer") || document.getElementById("appointmentContainer");

    if (!container) {
        return;
    }

    if (!loggedInUser) {
        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Login Required</h3>
                <p>Please login again to view your consultations.</p>
            </div>
        `;
        return;
    }

    const patientId = getVerifiedPatientId();

    if (!patientId) {
        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Patient ID Not Found</h3>
                <p>Please login again.</p>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(API_URL + "/api/consultations/patient/" + encodeURIComponent(patientId));
        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Unable to load consultations.");
        }

        let consultations = [];
        if (responseText && responseText.trim() !== "") {
            try {
                consultations = JSON.parse(responseText);
            } catch (error) {
                throw new Error("Invalid consultation data received.");
            }
        }

        if (!Array.isArray(consultations)) {
            throw new Error("Invalid consultation data received.");
        }

        container.innerHTML = "";

        // NO CONSULTATIONS
        if (consultations.length === 0) {
            container.innerHTML = `
                <div class="dashboard-card">
                    <h3>No Consultations</h3>
                    <p>You have not requested any consultations yet.</p>
                </div>
            `;
            return;
        }

        // DISPLAY CONSULTATIONS
        consultations.forEach(function(consultation) {
            const card = document.createElement("div");
            card.className = "dashboard-card";

            const status = (consultation.status || "PENDING").toString().trim().toUpperCase();

            let statusColor = "#f59e0b"; // Pending - Yellow
            let statusText = "Pending";

            if (status === "ACCEPTED") {
                statusText = "Accepted";
                statusColor = "#10b981"; // Green
            } else if (status === "REJECTED") {
                statusText = "Rejected";
                statusColor = "#ef4444"; // Red
            } else if (status === "CANCELLED") {
                statusText = "Cancelled";
                statusColor = "#6b7280"; // Gray
            } else if (status === "COMPLETED") {
                statusText = "Completed";
                statusColor = "#3b82f6"; // Blue
            }

            card.style.borderLeft = `4px solid ${statusColor}`;

            card.innerHTML = `
                <h3>Consultation #${escapeHTML(consultation.id ?? "N/A")}</h3>
                <p><strong>Doctor:</strong> ${escapeHTML(consultation.doctorUsername || consultation.doctorName || "Doctor #" + (consultation.doctorId || ""))}</p>
                <p><strong>Doctor ID:</strong> ${escapeHTML(consultation.doctorId ?? "N/A")}</p>
                <p><strong>Reason:</strong> ${escapeHTML(consultation.reason || "N/A")}</p>
                <p><strong>Status:</strong> 
                    <span style="font-weight:bold; color: ${statusColor}; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.05);">
                        ${escapeHTML(statusText)}
                    </span>
                </p>
                ${status === "PENDING" ? `
                    <button type="button" class="dashboard-btn" style="background-color: #ef4444; margin-top: 10px;" onclick="cancelConsultation(${consultation.id})">
                        Cancel Request
                    </button>
                ` : ""}
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Consultation Load Error:", error);
        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Unable to Load Consultations</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

// =====================================================
// CANCEL CONSULTATION
// =====================================================

async function cancelConsultation(consultationId) {
    if (!consultationId) return;

    const patientId = getVerifiedPatientId();
    if (!patientId) return;

    if (!confirm("Cancel this consultation request?")) {
        return;
    }

    try {
        const response = await hcAuthenticatedFetch(
            API_URL + "/api/consultations/" + consultationId + "/cancel/" + patientId,
            { method: "PUT" }
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Unable to cancel consultation.");
        }

        alert("Consultation cancelled successfully.");
        await loadConsultations();

    } catch (error) {
        console.error("Cancel Consultation Error:", error);
        alert("Unable to cancel consultation.\n\n" + error.message);
    }
}

// =====================================================
// MEDICAL RECORD ACCESS REQUESTS
// =====================================================

async function loadMedicalRecordAccessRequests() {
    if (!loggedInUser) return;

    const container = document.getElementById("medicalRecordAccessRequests");
    if (!container) return;

    container.innerHTML = "<p>Loading medical record access requests...</p>";

    try {
        const response = await hcAuthenticatedFetch(
            API_URL + "/api/medical-record-access/user/" + loggedInUser.id
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Unable to load access requests.");
        }

        const requests = JSON.parse(responseText);

        if (!Array.isArray(requests) || requests.length === 0) {
            container.innerHTML = `
                <div class="dashboard-card">
                    <h3>No Medical Record Requests</h3>
                    <p>You currently have no requests from doctors.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        requests.forEach(function(request) {
            const card = document.createElement("div");
            card.className = "dashboard-card";

            const status = request.status || "PENDING";
            let actionHTML = "";

            if (status.toUpperCase() === "PENDING") {
                actionHTML = `
                    <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
                        <button type="button" onclick="updateMedicalRecordAccess(${request.id}, 'APPROVED')">
                            Allow Access
                        </button>
                        <button type="button" onclick="updateMedicalRecordAccess(${request.id}, 'DENIED')">
                            Deny Access
                        </button>
                    </div>
                `;
            }

            card.innerHTML = `
                <h3>Medical Record Access Request</h3>
                <p><strong>Request ID:</strong> ${request.id}</p>
                <p><strong>Consultation ID:</strong> ${request.consultationId}</p>
                <p><strong>Doctor ID:</strong> ${request.doctorId}</p>
                <p><strong>Status:</strong> ${escapeHTML(status)}</p>
                ${actionHTML}
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Medical Record Access Error:", error);
        container.innerHTML = `
            <div class="dashboard-card">
                <h3>Unable to load requests</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

// =====================================================
// APPROVE / DENY MEDICAL RECORD ACCESS
// =====================================================

async function updateMedicalRecordAccess(requestId, status) {
    try {
        const response = await hcAuthenticatedFetch(
            API_URL + "/api/medical-record-access/" + requestId + "/status",
            {
                method: "PUT",
                body: JSON.stringify({ status: status })
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Unable to update request.");
        }

        if (status === "APPROVED") {
            alert("Medical record access approved.");
        } else {
            alert("Medical record access denied.");
        }

        loadMedicalRecordAccessRequests();

    } catch (error) {
        console.error("Medical Record Access Update Error:", error);
        alert("Unable to update medical record access request.\n\n" + error.message);
    }
}

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// =====================================================
// ESCAPE QUOTES
// =====================================================

function escapeQuotes(value) {
    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

// =====================================================
// START
// =====================================================

document.addEventListener("DOMContentLoaded", function() {
    showPatientInformation();
    loadConsultations();

    setInterval(function() {
        loadConsultations();
    }, 5000);

    loadMedicalRecordAccessRequests();

    const locationInput = document.getElementById("locationSearch");

    if (locationInput) {
        locationInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchDoctorsByLocation();
            }
        });
    }
});