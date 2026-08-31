// =====================================================
// HEALTHCONNECT
// GOVERNMENT / ADMIN DASHBOARD
// =====================================================

console.log(
    "HealthConnect Government Dashboard loaded."
);


// =====================================================
// API BASE URL
// =====================================================

const API_BASE =
    "http://localhost:8080/api";


// =====================================================
// GLOBAL DATA
// =====================================================

let patients = [];
let doctors = [];
let hospitals = [];
let appointments = [];
let medicalTests = [];

let selectedPatientId = null;


// =====================================================
// CHECK ADMIN LOGIN
// =====================================================

function checkAdminLogin() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    const storedUser =
        localStorage.getItem("loggedInUser");


    if (
        isLoggedIn !== "true" ||
        !storedUser
    ) {

        alert(
            "Please login first."
        );

        window.location.href =
            "../login.html";

        return false;
    }


    try {

        const user =
            JSON.parse(storedUser);


        if (
            !user.role ||
            user.role.toUpperCase() !== "ADMIN"
        ) {

            alert(
                "Access denied. Government Admin access required."
            );

            window.location.href =
                "../index.html";

            return false;
        }


        const adminName =
            document.getElementById(
                "adminName"
            );


        if (adminName) {

            adminName.textContent =
                user.fullName ||
                user.username ||
                "Administrator";
        }


        return true;

    }

    catch (error) {

        console.error(
            "Login data error:",
            error
        );

        localStorage.clear();

        window.location.href =
            "../login.html";

        return false;
    }
}


// =====================================================
// LOGOUT
// =====================================================

function adminLogout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    localStorage.removeItem(
        "isLoggedIn"
    );

    window.location.href =
        "../login.html";
}


// =====================================================
// API GET HELPER
// =====================================================

async function apiGet(url) {

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "API request failed: " +
            response.status
        );
    }


    return await response.json();
}


// =====================================================
// API PUT HELPER
// =====================================================

async function apiPut(url) {

    const response =
        await fetch(
            url,
            {
                method: "PUT"
            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            errorText ||
            "Update request failed."
        );
    }


    return await response.json();
}


// =====================================================
// LOAD ALL DASHBOARD DATA
// =====================================================

async function loadDashboardData() {

    try {

        showLoading();


        const results =
            await Promise.allSettled([

                apiGet(
                    `${API_BASE}/users`
                ),

                apiGet(
                    `${API_BASE}/doctors`
                ),

                apiGet(
                    `${API_BASE}/hospitals`
                ),

                apiGet(
                    `${API_BASE}/appointments`
                ),

                apiGet(
                    `${API_BASE}/medical-tests`
                )

            ]);


        // USERS

        if (
            results[0].status ===
            "fulfilled"
        ) {

            patients =
                results[0].value
                    .filter(
                        user =>
                            !user.role ||
                            user.role.toUpperCase()
                                === "USER"
                    );

        } else {

            patients = [];
        }


        // DOCTORS

        if (
            results[1].status ===
            "fulfilled"
        ) {

            doctors =
                results[1].value || [];

        } else {

            doctors = [];
        }


        // HOSPITALS

        if (
            results[2].status ===
            "fulfilled"
        ) {

            hospitals =
                results[2].value || [];

        } else {

            hospitals = [];
        }


        // APPOINTMENTS

        if (
            results[3].status ===
            "fulfilled"
        ) {

            appointments =
                results[3].value || [];

        } else {

            appointments = [];
        }


        // MEDICAL TESTS

        if (
            results[4].status ===
            "fulfilled"
        ) {

            medicalTests =
                results[4].value || [];

        } else {

            medicalTests = [];
        }


        updateStatistics();

        renderPatients();

        renderDoctors();

        renderHospitals();

        renderAppointments();

        renderTests();


        const failed =
            results.filter(
                result =>
                    result.status ===
                    "rejected"
            );


        if (failed.length > 0) {

            console.warn(
                failed.length +
                " dashboard API(s) failed."
            );
        }


    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        alert(
            "Unable to load dashboard data. Please check that the backend is running."
        );

    }

}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics() {

    document.getElementById(
        "totalPatients"
    ).textContent =
        patients.length;


    document.getElementById(
        "totalDoctors"
    ).textContent =
        doctors.length;


    document.getElementById(
        "totalHospitals"
    ).textContent =
        hospitals.length;


    document.getElementById(
        "totalAppointments"
    ).textContent =
        appointments.length;


    document.getElementById(
        "totalTests"
    ).textContent =
        medicalTests.length;


    const availableDoctors =
        doctors.filter(
            doctor =>
                doctor.available === true
        );


    document.getElementById(
        "availableDoctors"
    ).textContent =
        availableDoctors.length;


    const availableHospitals =
        hospitals.filter(
            hospital =>
                String(
                    hospital.available || ""
                ).toUpperCase() ===
                "YES"
        );


    document.getElementById(
        "availableHospitals"
    ).textContent =
        availableHospitals.length;


    const availableTests =
        medicalTests.filter(
            test =>
                test.available === true
        );


    document.getElementById(
        "availableTests"
    ).textContent =
        availableTests.length;
}


// =====================================================
// PATIENT TABLE
// =====================================================

function renderPatients(
    data = patients
) {

    const table =
        document.getElementById(
            "patientsTable"
        );


    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-row">
                    No patients found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        data.map(
            patient => `

                <tr>

                    <td>
                        ${safe(patient.id)}
                    </td>

                    <td>
                        ${safe(patient.fullName)}
                    </td>

                    <td>
                        ${safe(patient.email)}
                    </td>

                    <td>
                        ${safe(patient.mobile)}
                    </td>

                    <td>
                        ${safe(patient.username)}
                    </td>

                    <td>
                        ${safe(
                            patient.hospitalName ||
                            "Not Assigned"
                        )}
                    </td>

                    <td>

                        <button
                            class="assign-btn"
                            onclick="openHospitalModal(
                                ${patient.id},
                                '${escapeAttribute(
                                    patient.fullName || ""
                                )}'
                            )">

                            Assign Hospital

                        </button>

                    </td>

                </tr>

            `
        ).join("");
}


// =====================================================
// PATIENT SEARCH
// =====================================================

function filterPatients() {

    const search =
        document.getElementById(
            "patientSearch"
        ).value
        .toLowerCase();


    const filtered =
        patients.filter(
            patient =>

                String(
                    patient.fullName || ""
                ).toLowerCase()
                    .includes(search)

                ||

                String(
                    patient.email || ""
                ).toLowerCase()
                    .includes(search)

                ||

                String(
                    patient.username || ""
                ).toLowerCase()
                    .includes(search)

                ||

                String(
                    patient.hospitalName || ""
                ).toLowerCase()
                    .includes(search)
        );


    renderPatients(filtered);
}


// =====================================================
// DOCTOR TABLE
// =====================================================

function renderDoctors(
    data = doctors
) {

    const table =
        document.getElementById(
            "doctorsTable"
        );


    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="empty-row">
                    No doctors found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        data.map(
            doctor => `

                <tr>

                    <td>
                        ${safe(doctor.id)}
                    </td>

                    <td>
                        ${safe(doctor.fullName)}
                    </td>

                    <td>
                        ${safe(doctor.email)}
                    </td>

                    <td>
                        ${safe(
                            doctor.specialization
                        )}
                    </td>

                    <td>
                        ${safe(
                            doctor.qualification
                        )}
                    </td>

                    <td>
                        <span class="badge badge-blue">
                            ${safe(
                                doctor.doctorType
                            )}
                        </span>
                    </td>

                    <td>
                        ${safe(
                            doctor.location
                        )}
                    </td>

                    <td>
                        ${doctor.available
                            ? `<span class="badge badge-green">
                                Available
                               </span>`
                            : `<span class="badge badge-red">
                                Not Available
                               </span>`
                        }
                    </td>

                    <td>
                        ${doctor.status
                            ? `<span class="badge badge-yellow">
                                ${safe(
                                    doctor.status
                                )}
                               </span>`
                            : "-"
                        }
                    </td>

                </tr>

            `
        ).join("");
}


// =====================================================
// DOCTOR FILTER
// =====================================================

function filterDoctors() {

    const search =
        document.getElementById(
            "doctorSearch"
        ).value
        .toLowerCase();


    const type =
        document.getElementById(
            "doctorTypeFilter"
        ).value
        .toUpperCase();


    const filtered =
        doctors.filter(
            doctor => {

                const matchesSearch =

                    String(
                        doctor.fullName || ""
                    ).toLowerCase()
                        .includes(search)

                    ||

                    String(
                        doctor.email || ""
                    ).toLowerCase()
                        .includes(search)

                    ||

                    String(
                        doctor.specialization || ""
                    ).toLowerCase()
                        .includes(search)

                    ||

                    String(
                        doctor.location || ""
                    ).toLowerCase()
                        .includes(search);


                const matchesType =
                    !type ||
                    String(
                        doctor.doctorType || ""
                    ).toUpperCase() === type;


                return (
                    matchesSearch &&
                    matchesType
                );
            }
        );


    renderDoctors(filtered);
}


// =====================================================
// HOSPITAL TABLE
// =====================================================

function renderHospitals(
    data = hospitals
) {

    const table =
        document.getElementById(
            "hospitalsTable"
        );


    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-row">
                    No hospitals found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        data.map(
            hospital => `

                <tr>

                    <td>
                        ${safe(hospital.id)}
                    </td>

                    <td>
                        ${safe(
                            hospital.hospitalId
                        )}
                    </td>

                    <td>
                        ${safe(
                            hospital.name
                        )}
                    </td>

                    <td>
                        ${safe(
                            hospital.location
                        )}
                    </td>

                    <td>
                        <span class="badge badge-blue">
                            ${safe(
                                hospital.type
                            )}
                        </span>
                    </td>

                    <td>
                        ${safe(
                            hospital.emergencyContact
                        )}
                    </td>

                    <td>

                        ${
                            String(
                                hospital.available || ""
                            ).toUpperCase() === "YES"

                            ?

                            `<span class="badge badge-green">
                                Available
                             </span>`

                            :

                            `<span class="badge badge-red">
                                Not Available
                             </span>`
                        }

                    </td>

                </tr>

            `
        ).join("");
}


// =====================================================
// HOSPITAL FILTER
// =====================================================

function filterHospitals() {

    const search =
        document.getElementById(
            "hospitalSearch"
        ).value
        .toLowerCase();


    const type =
        document.getElementById(
            "hospitalTypeFilter"
        ).value
        .toUpperCase();


    const filtered =
        hospitals.filter(
            hospital => {

                const matchesSearch =

                    String(
                        hospital.name || ""
                    ).toLowerCase()
                        .includes(search)

                    ||

                    String(
                        hospital.location || ""
                    ).toLowerCase()
                        .includes(search)

                    ||

                    String(
                        hospital.hospitalId || ""
                    ).toLowerCase()
                        .includes(search);


                const matchesType =
                    !type ||
                    String(
                        hospital.type || ""
                    ).toUpperCase() === type;


                return (
                    matchesSearch &&
                    matchesType
                );
            }
        );


    renderHospitals(filtered);
}


// =====================================================
// APPOINTMENT TABLE
// =====================================================

function renderAppointments(
    data = appointments
) {

    const table =
        document.getElementById(
            "appointmentsTable"
        );


    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="empty-row">
                    No appointments found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        data.map(
            appointment => `

                <tr>

                    <td>
                        ${safe(
                            appointment.id
                        )}
                    </td>

                    <td>
                        ${safe(
                            appointment.userId
                        )}
                    </td>

                    <td>
                        ${safe(
                            appointment.doctorId
                        )}
                    </td>

                    <td>
                        ${safe(
                            appointment.hospitalId
                        )}
                    </td>

                    <td>
                        ${safe(
                            appointment.appointmentDate
                        )}
                    </td>

                    <td>
                        ${safe(
                            appointment.appointmentTime
                        )}
                    </td>

                    <td>
                        ${safe(
                            appointment.reason
                        )}
                    </td>

                    <td>
                        ${safe(
                            appointment.type
                        )}
                    </td>

                    <td>

                        <span
                            class="badge
                            ${getStatusClass(
                                appointment.status
                            )}">

                            ${safe(
                                appointment.status ||
                                "UNKNOWN"
                            )}

                        </span>

                    </td>

                </tr>

            `
        ).join("");
}


// =====================================================
// APPOINTMENT FILTER
// =====================================================

function filterAppointments() {

    const search =
        document.getElementById(
            "appointmentSearch"
        ).value
        .toLowerCase();


    const status =
        document.getElementById(
            "appointmentStatusFilter"
        ).value
        .toUpperCase();


    const filtered =
        appointments.filter(
            appointment => {

                const searchable = [

                    appointment.id,

                    appointment.userId,

                    appointment.doctorId,

                    appointment.hospitalId,

                    appointment.appointmentDate,

                    appointment.reason,

                    appointment.type

                ]
                .join(" ")
                .toLowerCase();


                const matchesSearch =
                    searchable.includes(
                        search
                    );


                const matchesStatus =
                    !status ||
                    String(
                        appointment.status || ""
                    ).toUpperCase() ===
                    status;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );


    renderAppointments(filtered);
}


// =====================================================
// MEDICAL TEST TABLE
// =====================================================

function renderTests(
    data = medicalTests
) {

    const table =
        document.getElementById(
            "testsTable"
        );


    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty-row">
                    No medical tests registered.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        data.map(
            test => `

                <tr>

                    <td>
                        ${safe(test.id)}
                    </td>

                    <td>
                        ${safe(
                            test.hospitalId
                        )}
                    </td>

                    <td>
                        ${safe(
                            test.testName
                        )}
                    </td>

                    <td>
                        ${safe(
                            test.description
                        )}
                    </td>

                    <td>
                        ₹${safe(
                            test.price ?? 0
                        )}
                    </td>

                    <td>
                        ${safe(
                            test.sampleType
                        )}
                    </td>

                    <td>
                        ${safe(
                            test.reportTime
                        )}
                    </td>

                    <td>

                        ${
                            test.available

                            ?

                            `<span class="badge badge-green">
                                Available
                             </span>`

                            :

                            `<span class="badge badge-red">
                                Unavailable
                             </span>`
                        }

                    </td>

                </tr>

            `
        ).join("");
}


// =====================================================
// MEDICAL TEST SEARCH
// =====================================================

function filterTests() {

    const search =
        document.getElementById(
            "testSearch"
        ).value
        .toLowerCase();


    const filtered =
        medicalTests.filter(
            test => {

                const searchable = [

                    test.testName,

                    test.description,

                    test.sampleType,

                    test.reportTime,

                    test.hospitalId

                ]
                .join(" ")
                .toLowerCase();


                return searchable.includes(
                    search
                );
            }
        );


    renderTests(filtered);
}


// =====================================================
// OPEN HOSPITAL MODAL
// =====================================================

function openHospitalModal(
    patientId,
    patientName
) {

    selectedPatientId =
        patientId;


    document.getElementById(
        "selectedPatientName"
    ).textContent =
        "Patient: " +
        patientName;


    document.getElementById(
        "hospitalNameInput"
    ).value = "";


    document.getElementById(
        "hospitalModal"
    ).classList.add("show");
}


// =====================================================
// CLOSE HOSPITAL MODAL
// =====================================================

function closeHospitalModal() {

    selectedPatientId = null;


    document.getElementById(
        "hospitalModal"
    ).classList.remove("show");
}


// =====================================================
// ASSIGN PATIENT TO HOSPITAL
// =====================================================

async function assignHospital() {

    if (!selectedPatientId) {

        alert(
            "Patient not selected."
        );

        return;
    }


    const hospitalName =
        document.getElementById(
            "hospitalNameInput"
        ).value.trim();


    if (!hospitalName) {

        alert(
            "Please enter hospital name."
        );

        return;
    }


    try {

        const url =
            `${API_BASE}/users/` +
            `${selectedPatientId}/hospital` +
            `?hospitalName=` +
            encodeURIComponent(
                hospitalName
            );


        await apiPut(url);


        alert(
            "Patient assigned to hospital successfully."
        );


        closeHospitalModal();


        await loadDashboardData();

    }

    catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Unable to assign hospital."
        );
    }
}


// =====================================================
// STATUS BADGE
// =====================================================

function getStatusClass(status) {

    const value =
        String(
            status || ""
        ).toUpperCase();


    if (
        value === "CONFIRMED" ||
        value === "COMPLETED" ||
        value === "APPROVED"
    ) {

        return "badge-green";
    }


    if (
        value === "CANCELLED" ||
        value === "REJECTED"
    ) {

        return "badge-red";
    }


    return "badge-yellow";
}


// =====================================================
// SAFE DISPLAY
// =====================================================

function safe(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";
    }


    return escapeHtml(
        String(value)
    );
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return value

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// ATTRIBUTE ESCAPE
// =====================================================

function escapeAttribute(value) {

    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /\r?\n/g,
            " "
        );
}


// =====================================================
// LOADING STATE
// =====================================================

function showLoading() {

    const ids = [

        "totalPatients",
        "totalDoctors",
        "totalHospitals",
        "totalAppointments",
        "totalTests",
        "availableDoctors",
        "availableHospitals",
        "availableTests"

    ];


    ids.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    "...";
            }

        }
    );
}


// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    const sectionId =
                        this.dataset.section;


                    navItems.forEach(
                        nav =>
                            nav.classList
                                .remove(
                                    "active"
                                )
                    );


                    this.classList.add(
                        "active"
                    );


                    document
                        .querySelectorAll(
                            ".admin-section"
                        )
                        .forEach(
                            section =>
                                section.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    const section =
                        document.getElementById(
                            sectionId
                        );


                    if (section) {

                        section.classList.add(
                            "active"
                        );
                    }


                    updatePageHeader(
                        sectionId
                    );

                }
            );

        }
    );
}


// =====================================================
// PAGE HEADER
// =====================================================

function updatePageHeader(
    sectionId
) {

    const title =
        document.getElementById(
            "pageTitle"
        );

    const subtitle =
        document.getElementById(
            "pageSubtitle"
        );


    const headers = {

        overview: [
            "Government Dashboard",
            "HealthConnect system overview"
        ],

        patients: [
            "Patient Management",
            "Registered patients and hospital associations"
        ],

        doctors: [
            "Doctor Management",
            "Registered doctors and availability"
        ],

        hospitals: [
            "Hospital Management",
            "Registered hospitals and facilities"
        ],

        appointments: [
            "Appointment Monitoring",
            "Appointments across the HealthConnect system"
        ],

        tests: [
            "Medical Test Monitoring",
            "Medical tests registered by hospitals"
        ]

    };


    const current =
        headers[sectionId];


    if (current) {

        title.textContent =
            current[0];

        subtitle.textContent =
            current[1];
    }
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        if (!checkAdminLogin()) {

            return;
        }


        setupNavigation();


        await loadDashboardData();

    }
);