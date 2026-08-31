// =====================================================
// HEALTHCONNECT
// DOCTOR DASHBOARD JAVASCRIPT
// =====================================================



// =====================================================
// API
// =====================================================

const DOCTOR_API =
    "http://localhost:8080/api/doctors";



// =====================================================
// REGISTERED DOCTORS CACHE
// =====================================================

let allRegisteredDoctors = [];



// =====================================================
// TOKEN
// =====================================================

function getDoctorAuthToken() {

    const authToken =
        localStorage.getItem(
            "authToken"
        );


    if (
        authToken &&
        authToken.trim() !== ""
    ) {

        return authToken.trim();

    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (
        token &&
        token.trim() !== ""
    ) {

        return token.trim();

    }


    return null;

}



// =====================================================
// AUTHENTICATED REQUEST
// =====================================================

async function doctorFetch(
    url,
    options = {}
) {

    const token =
        getDoctorAuthToken();


    const requestOptions = {
        ...options
    };


    requestOptions.headers = {
        ...(options.headers || {})
    };


    if (
        !requestOptions.headers["Content-Type"]
    ) {

        requestOptions.headers[
            "Content-Type"
        ] =
            "application/json";

    }


    if (token) {

        requestOptions.headers[
            "Authorization"
        ] =
            "Bearer " + token;

    }


    console.log(
        "Doctor API Request:",
        url
    );


    console.log(
        "JWT Present:",
        token ? "YES" : "NO"
    );


    return fetch(
        url,
        requestOptions
    );

}



// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "================================="
        );


        console.log(
            "HealthConnect Doctor Dashboard Loaded"
        );


        console.log(
            "================================="
        );


        setupDoctorDashboard();


        await loadLoggedInDoctor();


        await loadDoctors();

    }
);



// =====================================================
// SETUP DASHBOARD
// =====================================================

function setupDoctorDashboard() {

    const logoutButton =
        document.querySelector(
            ".doctor-header button"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                logoutDoctor();

            }
        );

    }

}



// =====================================================
// LOAD LOGGED-IN DOCTOR
// =====================================================

async function loadLoggedInDoctor() {

    const welcome =
        document.getElementById(
            "doctorWelcome"
        );


    const profile =
        document.getElementById(
            "doctorProfile"
        );


    // =================================================
    // READ LOCAL STORAGE
    // =================================================

    let storedDoctor =
        null;


    try {

        const doctorData =
            localStorage.getItem(
                "doctor"
            );


        const loggedInDoctorData =
            localStorage.getItem(
                "loggedInDoctor"
            );


        const loggedInUserData =
            localStorage.getItem(
                "loggedInUser"
            );


        if (
            doctorData
        ) {

            storedDoctor =
                JSON.parse(
                    doctorData
                );

        }

        else if (
            loggedInDoctorData
        ) {

            storedDoctor =
                JSON.parse(
                    loggedInDoctorData
                );

        }

        else if (
            loggedInUserData
        ) {

            storedDoctor =
                JSON.parse(
                    loggedInUserData
                );

        }

    }

    catch (error) {

        console.error(
            "Unable to read doctor localStorage:",
            error
        );

    }



    // =================================================
    // IF NOTHING FOUND
    // =================================================

    if (!storedDoctor) {

        if (welcome) {

            welcome.textContent =
                "Welcome Doctor";

        }


        if (profile) {

            profile.innerHTML = `

                <p style="color:red;">

                    Doctor login information
                    was not found.

                    <br><br>

                    Please login again.

                </p>

            `;

        }


        console.warn(
            "No logged-in doctor found in localStorage."
        );


        return;

    }



    // =================================================
    // SHOW TEMPORARY NAME
    // =================================================

    const temporaryName =
        storedDoctor.fullName ||
        storedDoctor.name ||
        storedDoctor.username ||
        "Doctor";


    if (welcome) {

        welcome.textContent =
            "Welcome, Dr. " +
            temporaryName +
            "!";

    }



    // =================================================
    // TRY TO GET COMPLETE DOCTOR FROM BACKEND
    // =================================================

    let completeDoctor =
        null;


    try {

        const response =
            await doctorFetch(
                DOCTOR_API
            );


        console.log(
            "Complete Doctor API Status:",
            response.status
        );


        if (
            response.ok
        ) {

            const doctors =
                await response.json();


            if (
                Array.isArray(
                    doctors
                )
            ) {

                completeDoctor =
                    findLoggedInDoctor(
                        doctors,
                        storedDoctor
                    );

            }

        }

        else {

            console.error(
                "Unable to load doctor profile. HTTP:",
                response.status
            );

        }

    }

    catch (error) {

        console.error(
            "Doctor profile API error:",
            error
        );

    }



    // =================================================
    // USE COMPLETE PROFILE
    // =================================================

    const doctor =
        completeDoctor ||
        storedDoctor;



    // =================================================
    // SAVE COMPLETE PROFILE
    // =================================================

    if (
        completeDoctor
    ) {

        try {

            const token =
                getDoctorAuthToken();


            const completeDoctorObject = {

                ...completeDoctor,

                role:
                    "DOCTOR",

                token:
                    token ||
                    completeDoctor.token ||
                    storedDoctor.token ||
                    ""

            };


            localStorage.setItem(
                "doctor",
                JSON.stringify(
                    completeDoctorObject
                )
            );


            localStorage.setItem(
                "loggedInDoctor",
                JSON.stringify(
                    completeDoctorObject
                )
            );


            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(
                    completeDoctorObject
                )
            );


            console.log(
                "Complete Doctor Profile Saved:",
                completeDoctorObject
            );

        }

        catch (error) {

            console.error(
                "Unable to save doctor profile:",
                error
            );

        }

    }



    // =================================================
    // DISPLAY PROFILE
    // =================================================

    displayDoctorProfile(
        doctor
    );

}



// =====================================================
// FIND LOGGED-IN DOCTOR
// =====================================================

function findLoggedInDoctor(
    doctors,
    storedDoctor
) {

    if (
        !Array.isArray(
            doctors
        )
    ) {

        return null;

    }


    if (
        !storedDoctor
    ) {

        return null;

    }


    const storedUsername =
        storedDoctor.username
            ? storedDoctor.username
                .toString()
                .trim()
                .toLowerCase()
            : "";


    const storedEmail =
        storedDoctor.email
            ? storedDoctor.email
                .toString()
                .trim()
                .toLowerCase()
            : "";


    const storedId =
        storedDoctor.id
            ? String(
                storedDoctor.id
            )
            : "";



    // =================================================
    // FIRST: USERNAME
    // =================================================

    if (
        storedUsername !== ""
    ) {

        const byUsername =
            doctors.find(
                function (doctor) {

                    return (
                        doctor.username &&
                        doctor.username
                            .toString()
                            .trim()
                            .toLowerCase() ===
                        storedUsername
                    );

                }
            );


        if (
            byUsername
        ) {

            return byUsername;

        }

    }



    // =================================================
    // SECOND: EMAIL
    // =================================================

    if (
        storedEmail !== ""
    ) {

        const byEmail =
            doctors.find(
                function (doctor) {

                    return (
                        doctor.email &&
                        doctor.email
                            .toString()
                            .trim()
                            .toLowerCase() ===
                        storedEmail
                    );

                }
            );


        if (
            byEmail
        ) {

            return byEmail;

        }

    }



    // =================================================
    // THIRD: ID
    // =================================================

    if (
        storedId !== ""
    ) {

        const byId =
            doctors.find(
                function (doctor) {

                    return (
                        doctor.id &&
                        String(
                            doctor.id
                        ) ===
                        storedId
                    );

                }
            );


        if (
            byId
        ) {

            return byId;

        }

    }


    return null;

}



// =====================================================
// DISPLAY DOCTOR PROFILE
// =====================================================

function displayDoctorProfile(
    doctor
) {

    const welcome =
        document.getElementById(
            "doctorWelcome"
        );


    const profile =
        document.getElementById(
            "doctorProfile"
        );


    if (!profile) {

        return;

    }


    const doctorName =
        doctor.fullName ||
        doctor.name ||
        doctor.username ||
        "Doctor";


    if (welcome) {

        welcome.textContent =
            "Welcome, Dr. " +
            doctorName +
            "!";

    }


    const doctorType =
        doctor.doctorType
            ? doctor.doctorType
                .toString()
                .trim()
                .toUpperCase()
            : "-";


    let doctorTypeText =
        doctorType;


    if (
        doctorType ===
        "GOVERNMENT"
    ) {

        doctorTypeText =
            "Government";

    }

    else if (
        doctorType ===
        "PRIVATE"
    ) {

        doctorTypeText =
            "Private";

    }


    const availability =
        doctor.available === true
            ? "Available"
            : "Not Available";


    const status =
        doctor.status ||
        "PENDING";


    profile.innerHTML = `

        <div class="doctor-item">

            <h3>

                ${escapeHTML(
                    doctorName
                )}

            </h3>


            <p>

                <strong>
                    Doctor ID:
                </strong>

                ${doctor.id ?? "-"}

            </p>


            <p>

                <strong>
                    Username:
                </strong>

                ${escapeHTML(
                    doctor.username ||
                    "-"
                )}

            </p>


            <p>

                <strong>
                    Email:
                </strong>

                ${escapeHTML(
                    doctor.email ||
                    "-"
                )}

            </p>


            <p>

                <strong>
                    Mobile:
                </strong>

                ${escapeHTML(
                    doctor.mobile ||
                    "-"
                )}

            </p>


            <p>

                <strong>
                    Specialization:
                </strong>

                ${escapeHTML(
                    doctor.specialization ||
                    "-"
                )}

            </p>


            <p>

                <strong>
                    Qualification:
                </strong>

                ${escapeHTML(
                    doctor.qualification ||
                    "-"
                )}

            </p>


            <p>

                <strong>
                    Experience:
                </strong>

                ${doctor.experience ?? 0}
                years

            </p>


            <p>

                <strong>
                    Doctor Type:
                </strong>

                ${escapeHTML(
                    doctorTypeText
                )}

            </p>


            <p>

                <strong>
                    Hospital:
                </strong>

                ${escapeHTML(
                    doctor.hospitalName ||
                    "-"
                )}

            </p>


            <p>

                <strong>
                    Hospital Address:
                </strong>

                ${escapeHTML(
                    doctor.hospitalAddress ||
                    "-"
                )}

            </p>


            <p>

                <strong>
                    Consultation Fee:
                </strong>

                ₹${doctor.consultationFee ?? 0}

            </p>


            <p>

                <strong>
                    Availability:
                </strong>

                ${availability}

            </p>


            <p>

                <strong>
                    Account Status:
                </strong>

                ${escapeHTML(
                    status
                )}

            </p>

        </div>

    `;

}



// =====================================================
// LOAD ALL REGISTERED DOCTORS
// =====================================================

async function loadDoctors() {

    const doctorList =
        document.getElementById(
            "doctorList"
        );


    if (!doctorList) {

        return;

    }


    doctorList.innerHTML = `

        <p>

            Loading registered doctors...

        </p>

    `;


    try {

        const response =
            await doctorFetch(
                DOCTOR_API
            );


        console.log(
            "Registered Doctors HTTP Status:",
            response.status
        );



        // =================================================
        // UNAUTHORIZED
        // =================================================

        if (
            response.status ===
            401
        ) {

            doctorList.innerHTML = `

                <p style="color:red;">

                    Your login session is not available.

                    <br><br>

                    Please login again.

                </p>

            `;


            console.error(
                "Doctor API returned 401 Unauthorized."
            );


            return;

        }



        // =================================================
        // FORBIDDEN
        // =================================================

        if (
            response.status ===
            403
        ) {

            doctorList.innerHTML = `

                <p style="color:red;">

                    Access denied for doctor account.

                    <br><br>

                    Please login again as a Doctor.

                </p>

            `;


            console.error(
                "Doctor API returned 403 Forbidden."
            );


            return;

        }



        // =================================================
        // OTHER ERROR
        // =================================================

        if (
            !response.ok
        ) {

            throw new Error(
                "Doctor API returned HTTP " +
                response.status
            );

        }



        // =================================================
        // READ JSON
        // =================================================

        const doctors =
            await response.json();


        console.log(
            "Registered Doctors:",
            doctors
        );



        // =================================================
        // SAVE DOCTORS IN CACHE
        // =================================================

        if (
            Array.isArray(
                doctors
            )
        ) {

            allRegisteredDoctors =
                doctors;

        }

        else {

            allRegisteredDoctors =
                [];

        }



        // =================================================
        // DISPLAY DOCTORS
        // =================================================

        displayDoctors(
            allRegisteredDoctors
        );

    }

    catch (error) {

        console.error(
            "Doctor API Error:",
            error
        );


        showDoctorError(
            error
        );

    }

}



// =====================================================
// SEARCH / FILTER REGISTERED DOCTORS
// =====================================================

function filterDoctors() {

    const searchInput =
        document.getElementById(
            "doctorSearch"
        );


    if (!searchInput) {

        return;

    }


    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();



    // =================================================
    // IF SEARCH IS EMPTY
    // =================================================

    if (
        searchValue === ""
    ) {

        displayDoctors(
            allRegisteredDoctors
        );

        return;

    }



    // =================================================
    // FILTER BY
    // 1. DOCTOR NAME
    // 2. DOCTOR ID
    // 3. SPECIALIZATION
    // =================================================

    const filteredDoctors =
        allRegisteredDoctors.filter(
            function (doctor) {

                const doctorName =
                    doctor.fullName
                        ? doctor.fullName
                            .toString()
                            .toLowerCase()
                        : "";


                const doctorId =
                    doctor.id !== undefined &&
                    doctor.id !== null
                        ? String(
                            doctor.id
                        ).toLowerCase()
                        : "";


                const specialization =
                    doctor.specialization
                        ? doctor.specialization
                            .toString()
                            .toLowerCase()
                        : "";



                return (
                    doctorName.includes(
                        searchValue
                    ) ||

                    doctorId.includes(
                        searchValue
                    ) ||

                    specialization.includes(
                        searchValue
                    )
                );

            }
        );



    // =================================================
    // DISPLAY SEARCH RESULTS
    // =================================================

    displayDoctors(
        filteredDoctors
    );

}



// =====================================================
// DISPLAY DOCTORS
// =====================================================

function displayDoctors(
    doctors
) {

    const doctorList =
        document.getElementById(
            "doctorList"
        );


    if (!doctorList) {

        return;

    }



    // =================================================
    // INVALID DATA
    // =================================================

    if (
        !Array.isArray(
            doctors
        )
    ) {

        doctorList.innerHTML = `

            <p style="color:red;">

                Invalid doctor data received
                from backend.

            </p>

        `;

        return;

    }



    // =================================================
    // NO DOCTORS
    // =================================================

    if (
        doctors.length === 0
    ) {

        doctorList.innerHTML = `

            <p>

                No registered doctors found
                matching your search.

            </p>

        `;

        return;

    }



    // =================================================
    // CLEAR OLD LIST
    // =================================================

    doctorList.innerHTML =
        "";



    // =================================================
    // CREATE DOCTOR CARDS
    // =================================================

    doctors.forEach(
        function (doctor) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "doctor-item";



            // =================================================
            // DOCTOR TYPE
            // =================================================

            const doctorType =
                doctor.doctorType
                    ? doctor.doctorType
                        .toString()
                        .trim()
                        .toUpperCase()
                    : "-";


            let doctorTypeText =
                doctorType;


            if (
                doctorType ===
                "GOVERNMENT"
            ) {

                doctorTypeText =
                    "Government";

            }

            else if (
                doctorType ===
                "PRIVATE"
            ) {

                doctorTypeText =
                    "Private";

            }



            // =================================================
            // AVAILABILITY
            // =================================================

            const availableText =
                doctor.available === true
                    ? "Available"
                    : "Not Available";



            // =================================================
            // STATUS
            // =================================================

            const statusText =
                doctor.status ||
                "PENDING";



            // =================================================
            // CARD HTML
            // =================================================

            card.innerHTML = `

                <h3>

                    ${escapeHTML(
                        doctor.fullName ||
                        "Doctor"
                    )}

                </h3>


                <p>

                    <strong>
                        Doctor ID:
                    </strong>

                    ${doctor.id ?? "-"}

                </p>


                <p>

                    <strong>
                        Username:
                    </strong>

                    ${escapeHTML(
                        doctor.username ||
                        "-"
                    )}

                </p>


                <p>

                    <strong>
                        Specialization:
                    </strong>

                    ${escapeHTML(
                        doctor.specialization ||
                        "-"
                    )}

                </p>


                <p>

                    <strong>
                        Qualification:
                    </strong>

                    ${escapeHTML(
                        doctor.qualification ||
                        "-"
                    )}

                </p>


                <p>

                    <strong>
                        Experience:
                    </strong>

                    ${doctor.experience ?? 0}
                    years

                </p>


                <p>

                    <strong>
                        Hospital:
                    </strong>

                    ${escapeHTML(
                        doctor.hospitalName ||
                        "-"
                    )}

                </p>


                <p>

                    <strong>
                        Hospital Address:
                    </strong>

                    ${escapeHTML(
                        doctor.hospitalAddress ||
                        "-"
                    )}

                </p>


                <p>

                    <strong>
                        Doctor Type:
                    </strong>

                    ${escapeHTML(
                        doctorTypeText
                    )}

                </p>


                <p>

                    <strong>
                        Consultation Fee:
                    </strong>

                    ₹${doctor.consultationFee ?? 0}

                </p>


                <p>

                    <strong>
                        Available:
                    </strong>

                    ${availableText}

                </p>


                <p>

                    <strong>
                        Status:
                    </strong>

                    ${escapeHTML(
                        statusText
                    )}

                </p>

            `;



            // =================================================
            // ADD CARD TO LIST
            // =================================================

            doctorList.appendChild(
                card
            );

        }
    );

}



// =====================================================
// DOCTOR API ERROR
// =====================================================

function showDoctorError(
    error
) {

    const doctorList =
        document.getElementById(
            "doctorList"
        );


    if (!doctorList) {

        return;

    }


    doctorList.innerHTML = `

        <p style="color:red;">

            Unable to load registered doctors.

            <br><br>

            Please make sure:

            <br>

            1. Spring Boot backend is running.

            <br>

            2. You are logged in as Doctor.

            <br>

            3. JWT token is available.

        </p>

    `;

}



// =====================================================
// HTML SAFETY
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value
    )

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



// =====================================================
// LOGOUT DOCTOR
// =====================================================

function logoutDoctor() {

    console.log(
        "Doctor Logout Started"
    );



    // =================================================
    // REMOVE ALL AUTH DATA
    // =================================================

    localStorage.removeItem(
        "loggedInUser"
    );


    localStorage.removeItem(
        "loggedInDoctor"
    );


    localStorage.removeItem(
        "doctor"
    );


    localStorage.removeItem(
        "loggedInHospital"
    );


    localStorage.removeItem(
        "hospital"
    );


    localStorage.removeItem(
        "loggedInStudent"
    );


    localStorage.removeItem(
        "userRole"
    );


    localStorage.removeItem(
        "isLoggedIn"
    );


    localStorage.removeItem(
        "authToken"
    );


    localStorage.removeItem(
        "token"
    );


    console.log(
        "Doctor authentication data removed."
    );



    // =================================================
    // REDIRECT
    // =================================================

    window.location.replace(
        "../login.html"
    );

}



// =====================================================
// GLOBAL EXPORTS
// =====================================================

window.loadDoctors =
    loadDoctors;


window.loadLoggedInDoctor =
    loadLoggedInDoctor;


window.logoutDoctor =
    logoutDoctor;


window.displayDoctors =
    displayDoctors;


window.filterDoctors =
    filterDoctors;



console.log(
    "HealthConnect Doctor Dashboard JavaScript Ready"
);