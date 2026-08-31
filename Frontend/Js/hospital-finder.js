// =====================================================
// HEALTHCONNECT
// HOSPITAL FINDER
// JWT CONNECTED VERSION
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
    "http://localhost:8080";


// =====================================================
// AUTHENTICATION
// =====================================================

function hcGetAuthToken() {

    const tokenKeys = [
        "token",
        "jwt",
        "accessToken"
    ];


    for (const key of tokenKeys) {

        const token =
            localStorage.getItem(
                key
            );


        if (
            token &&
            token.trim() !== ""
        ) {

            return token.trim();

        }

    }


    const storedUser =
        localStorage.getItem(
            "loggedInUser"
        );


    if (storedUser) {

        try {

            const user =
                JSON.parse(
                    storedUser
                );


            const token =
                user.token ||
                user.jwt ||
                user.accessToken;


            if (
                token &&
                String(
                    token
                ).trim() !== ""
            ) {

                return String(
                    token
                ).trim();

            }

        }
        catch (error) {

            console.error(
                "Unable to read authentication data:",
                error
            );

        }

    }


    return null;
}


// =====================================================
// AUTHENTICATED FETCH
// =====================================================

async function hcAuthenticatedFetch(
    url,
    options = {}
) {

    const token =
        hcGetAuthToken();


    if (!token) {

        alert(
            "Your login session has expired. Please login again."
        );


        localStorage.removeItem(
            "loggedInUser"
        );

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "userRole"
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "jwt"
        );

        localStorage.removeItem(
            "accessToken"
        );


        window.location.href =
            "../login.html";


        throw new Error(
            "Authentication token not found."
        );

    }


    const requestOptions = {
        ...options
    };


    requestOptions.headers = {
        ...(options.headers || {})
    };


    if (
        requestOptions.body &&
        !(requestOptions.body instanceof FormData) &&
        !requestOptions.headers["Content-Type"]
    ) {

        requestOptions.headers[
            "Content-Type"
        ] =
            "application/json";

    }


    requestOptions.headers[
        "Authorization"
    ] =
        "Bearer " + token;


    const response =
        await window.fetch(
            url,
            requestOptions
        );


    if (
        response.status === 401
    ) {

        localStorage.removeItem(
            "loggedInUser"
        );

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "userRole"
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "jwt"
        );

        localStorage.removeItem(
            "accessToken"
        );


        alert(
            "Your login session has expired. Please login again."
        );


        window.location.href =
            "../login.html";


        throw new Error(
            "Unauthorized request."
        );

    }


    return response;

}


// =====================================================
// LOGGED-IN USER
// =====================================================

const storedUser =
    localStorage.getItem(
        "loggedInUser"
    );


let loggedInUser =
    null;


if (storedUser) {

    try {

        loggedInUser =
            JSON.parse(
                storedUser
            );

    }
    catch (error) {

        console.error(
            "Unable to read logged-in user:",
            error
        );

    }

}


if (!loggedInUser) {

    alert(
        "Please login first."
    );


    window.location.href =
        "../login.html";

}


// =====================================================
// CURRENT DATA
// =====================================================

let allHospitals =
    [];

let selectedHospital =
    null;


// =====================================================
// LOAD HOSPITALS
// =====================================================

async function loadHospitals() {

    const container =
        document.getElementById(
            "hospitalContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "<p>Loading hospitals...</p>";


    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/hospitals"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load hospitals."
            );

        }


        const hospitals =
            await response.json();


        allHospitals =
            Array.isArray(
                hospitals
            )
                ? hospitals
                : [];


        displayHospitals(
            allHospitals
        );

    }
    catch (error) {

        console.error(
            "Hospital API Error:",
            error
        );


        container.innerHTML = `

            <div class="dashboard-card">

                <h3>
                    Unable to Load Hospitals
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// =====================================================
// DISPLAY HOSPITALS
// =====================================================

function displayHospitals(
    hospitals
) {

    const container =
        document.getElementById(
            "hospitalContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            hospitals
        ) ||
        hospitals.length === 0
    ) {

        container.innerHTML = `

            <div class="dashboard-card">

                <h3>
                    No Hospitals Found
                </h3>

                <p>
                    No hospitals are currently
                    available.
                </p>

            </div>

        `;

        return;

    }


    hospitals.forEach(
        function(hospital) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "dashboard-card";


            const available =
                hospital.available === true ||
                String(
                    hospital.available
                ).toLowerCase() ===
                "true"
                    ? "Available"
                    : "Not Available";


            card.innerHTML = `

                <h3>

                    🏥
                    ${escapeHTML(
                        hospital.name ||
                        "Hospital"
                    )}

                </h3>


                <p>

                    <strong>
                        Hospital ID:
                    </strong>

                    ${escapeHTML(
                        hospital.hospitalId ||
                        hospital.id ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Location:
                    </strong>

                    ${escapeHTML(
                        hospital.location ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Type:
                    </strong>

                    ${escapeHTML(
                        hospital.type ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Emergency:
                    </strong>

                    ${escapeHTML(
                        hospital.emergencyContact ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Availability:
                    </strong>

                    ${escapeHTML(
                        available
                    )}

                </p>


                <div class="hospital-actions">

                    <button
                        type="button"
                        class="dashboard-btn"
                        onclick="viewHospital(
                            ${hospital.id}
                        )">

                        View Hospital

                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// FILTER HOSPITALS
// =====================================================

function filterHospitals() {

    const locationInput =
        document.getElementById(
            "locationSearch"
        );


    const typeInput =
        document.getElementById(
            "typeSearch"
        );


    const location =
        locationInput
            ? locationInput.value
                .trim()
                .toLowerCase()
            : "";


    const type =
        typeInput
            ? typeInput.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        allHospitals.filter(
            function(hospital) {

                const hospitalLocation =
                    String(
                        hospital.location ||
                        ""
                    )
                    .toLowerCase();


                const hospitalType =
                    String(
                        hospital.type ||
                        ""
                    )
                    .toLowerCase();


                const locationMatch =
                    !location ||
                    hospitalLocation.includes(
                        location
                    );


                const typeMatch =
                    !type ||
                    hospitalType.includes(
                        type
                    );


                return (
                    locationMatch &&
                    typeMatch
                );

            }
        );


    displayHospitals(
        filtered
    );

}


// =====================================================
// VIEW HOSPITAL
// =====================================================
// IMPORTANT:
// View Hospital now opens the separate
// hospital-information.html page.
// It does NOT open hospital details
// inside the Hospital Finder page.
// =====================================================

async function viewHospital(
    hospitalId
) {

    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/hospitals/" +
                hospitalId
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load hospital details."
            );

        }


        const hospital =
            await response.json();


        if (!hospital) {

            throw new Error(
                "Hospital information was not received."
            );

        }


        selectedHospital =
            hospital;


        // -------------------------------------------------
        // SAVE SELECTED HOSPITAL
        // -------------------------------------------------

        localStorage.setItem(
            "loggedInHospital",
            JSON.stringify(
                hospital
            )
        );


        localStorage.setItem(
            "hospital",
            JSON.stringify(
                hospital
            )
        );


        // -------------------------------------------------
        // OPEN HOSPITAL INFORMATION PAGE
        // -------------------------------------------------

        window.location.href =
            "../Hospital/hospital-information.html";

    }
    catch (error) {

        console.error(
            "Unable to open hospital information:",
            error
        );


        alert(
            "Unable to load hospital information."
        );

    }

}


// =====================================================
// DISPLAY HOSPITAL DETAILS
// =====================================================
// Kept here so existing code/functionality
// is not broken.
// =====================================================

function displayHospitalDetails(
    hospital
) {

    const container =
        document.getElementById(
            "hospitalDetails"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <h2>

            🏥
            ${escapeHTML(
                hospital.name ||
                "Hospital"
            )}

        </h2>


        <p>

            <strong>
                Hospital ID:
            </strong>

            ${escapeHTML(
                hospital.hospitalId ||
                hospital.id ||
                "N/A"
            )}

        </p>


        <p>

            <strong>
                Location:
            </strong>

            ${escapeHTML(
                hospital.location ||
                "N/A"
            )}

        </p>


        <p>

            <strong>
                Type:
            </strong>

            ${escapeHTML(
                hospital.type ||
                "N/A"
            )}

        </p>


        <p>

            <strong>
                Emergency Contact:
            </strong>

            ${escapeHTML(
                hospital.emergencyContact ||
                "N/A"
            )}

        </p>


        <p>

            <strong>
                Facilities:
            </strong>

            ${escapeHTML(
                hospital.facilities ||
                "N/A"
            )}

        </p>


        <p>

            <strong>
                Availability:
            </strong>

            ${escapeHTML(
                hospital.available ||
                "N/A"
            )}

        </p>

    `;

}


// =====================================================
// LOAD HOSPITAL DOCTORS
// =====================================================

async function loadHospitalDoctors(
    hospitalName
) {

    const container =
        document.getElementById(
            "hospitalDoctors"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "<p>Loading doctors...</p>";


    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/doctors/hospital/" +
                encodeURIComponent(
                    hospitalName
                ) +
                "/available"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load doctors."
            );

        }


        const doctors =
            await response.json();


        displayHospitalDoctors(
            doctors
        );

    }
    catch (error) {

        console.error(
            error
        );


        container.innerHTML = `

            <div class="doctor-card">

                <h3>
                    Unable to Load Doctors
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// =====================================================
// DISPLAY HOSPITAL DOCTORS
// =====================================================

function displayHospitalDoctors(
    doctors
) {

    const container =
        document.getElementById(
            "hospitalDoctors"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            doctors
        ) ||
        doctors.length === 0
    ) {

        container.innerHTML = `

            <div class="doctor-card">

                <h3>
                    No Doctors Available
                </h3>

                <p>
                    No available doctors were found
                    for this hospital.
                </p>

            </div>

        `;

        return;

    }


    doctors.forEach(
        function(doctor) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "doctor-card";


            card.innerHTML = `

                <h3>

                    👨‍⚕️
                    ${escapeHTML(
                        doctor.fullName ||
                        "Doctor"
                    )}

                </h3>


                <p>

                    <strong>
                        Doctor ID:
                    </strong>

                    ${doctor.id ?? "N/A"}

                </p>


                <p>

                    <strong>
                        Specialization:
                    </strong>

                    ${escapeHTML(
                        doctor.specialization ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Qualification:
                    </strong>

                    ${escapeHTML(
                        doctor.qualification ||
                        "N/A"
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
                        Consultation Fee:
                    </strong>

                    ${
                        doctor.consultationFee ===
                            null ||
                        doctor.consultationFee ===
                            undefined
                            ? "N/A"
                            :
                        Number(
                            doctor.consultationFee
                        ) === 0
                            ? "Free"
                            :
                        "₹" +
                        doctor.consultationFee
                    }

                </p>


                <div class="hospital-actions">

                    <button
                        type="button"
                        class="dashboard-btn"
                        onclick="bookHospitalDoctorAppointment(
                            ${doctor.id},
                            '${escapeQuotes(
                                doctor.fullName ||
                                "Doctor"
                            )}'
                        )">

                        Book Appointment

                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// BOOK HOSPITAL DOCTOR APPOINTMENT
// =====================================================

async function bookHospitalDoctorAppointment(
    doctorId,
    doctorName
) {

    if (!loggedInUser) {

        alert(
            "Please login first."
        );

        return;

    }


    if (!selectedHospital) {

        alert(
            "Hospital information is missing."
        );

        return;

    }


    const date =
        prompt(
            "Enter appointment date (YYYY-MM-DD):"
        );


    if (!date) {

        return;

    }


    const time =
        prompt(
            "Enter appointment time (HH:MM):"
        );


    if (!time) {

        return;

    }


    const reason =
        prompt(
            "Enter reason for consultation:"
        );


    if (!reason) {

        return;

    }


    const appointment = {

        userId:
            loggedInUser.id,

        doctorId:
            doctorId,

        hospitalId:
            selectedHospital.id,

        appointmentDate:
            date,

        appointmentTime:
            time,

        reason:
            reason,

        type:
            "HOSPITAL",

        status:
            "PENDING"

    };


    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/appointments",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            appointment
                        )

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Appointment booking failed."
            );

        }


        const result =
            await response.json();


        showHospitalMessage(
            "Appointment booked successfully with " +
            doctorName +
            ". Appointment ID: " +
            result.id,
            true
        );

    }
    catch (error) {

        console.error(
            error
        );


        showHospitalMessage(
            "Unable to book appointment: " +
            error.message,
            false
        );

    }

}


// =====================================================
// LOAD HOSPITAL TESTS
// =====================================================

async function loadHospitalTests(
    hospitalId
) {

    const container =
        document.getElementById(
            "hospitalTests"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "<p>Loading medical tests...</p>";


    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/medical-tests/hospital/" +
                hospitalId +
                "/available"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load medical tests."
            );

        }


        const tests =
            await response.json();


        displayHospitalTests(
            tests
        );

    }
    catch (error) {

        console.error(
            error
        );


        container.innerHTML = `

            <div class="test-card">

                <h3>
                    Unable to Load Tests
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// =====================================================
// DISPLAY HOSPITAL TESTS
// =====================================================

function displayHospitalTests(
    tests
) {

    const container =
        document.getElementById(
            "hospitalTests"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            tests
        ) ||
        tests.length === 0
    ) {

        container.innerHTML = `

            <div class="test-card">

                <h3>
                    No Tests Available
                </h3>

                <p>
                    This hospital currently has
                    no medical tests registered.
                </p>

            </div>

        `;

        return;

    }


    tests.forEach(
        function(test) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "test-card";


            const price =
                test.price === null ||
                test.price === undefined ||
                Number(
                    test.price
                ) === 0
                    ? "Free"
                    :
                    "₹" +
                    test.price;


            card.innerHTML = `

                <h3>

                    🧪
                    ${escapeHTML(
                        test.testName ||
                        "Medical Test"
                    )}

                </h3>


                <p>

                    <strong>
                        Description:
                    </strong>

                    ${escapeHTML(
                        test.description ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Price:
                    </strong>

                    ${price}

                </p>


                <p>

                    <strong>
                        Sample:
                    </strong>

                    ${escapeHTML(
                        test.sampleType ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Report Time:
                    </strong>

                    ${escapeHTML(
                        test.reportTime ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Preparation:
                    </strong>

                    ${escapeHTML(
                        test.preparationInstructions ||
                        "N/A"
                    )}

                </p>


                <div class="hospital-actions">

                    <button
                        type="button"
                        class="dashboard-btn"
                        onclick="showTestBookingForm(
                            ${test.id},
                            '${escapeQuotes(
                                test.testName ||
                                "Medical Test"
                            )}'
                        )">

                        Book Test

                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// SHOW TEST BOOKING FORM
// =====================================================

function showTestBookingForm(
    testId,
    testName
) {

    const container =
        document.getElementById(
            "hospitalMessage"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="booking-form">

            <h3>

                Book:
                ${escapeHTML(
                    testName
                )}

            </h3>


            <input
                type="date"
                id="testBookingDate"
            >


            <input
                type="time"
                id="testBookingTime"
            >


            <button
                type="button"
                class="dashboard-btn"
                onclick="bookMedicalTest(
                    ${testId}
                )">

                Confirm Test Booking

            </button>

        </div>

    `;

}


// =====================================================
// BOOK MEDICAL TEST
// =====================================================

async function bookMedicalTest(
    testId
) {

    if (!loggedInUser) {

        alert(
            "Please login first."
        );

        return;

    }


    if (!selectedHospital) {

        alert(
            "Hospital information is missing."
        );

        return;

    }


    const dateInput =
        document.getElementById(
            "testBookingDate"
        );


    const timeInput =
        document.getElementById(
            "testBookingTime"
        );


    const date =
        dateInput
            ? dateInput.value
            : "";


    const time =
        timeInput
            ? timeInput.value
            : "";


    if (!date) {

        alert(
            "Please select test date."
        );

        return;

    }


    if (!time) {

        alert(
            "Please select test time."
        );

        return;

    }


    const booking = {

        userId:
            loggedInUser.id,

        hospitalId:
            selectedHospital.id,

        medicalTestId:
            testId,

        bookingDate:
            date,

        bookingTime:
            time,

        status:
            "PENDING"

    };


    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/test-bookings",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            booking
                        )

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Test booking failed."
            );

        }


        const result =
            await response.json();


        showHospitalMessage(
            "Medical test booked successfully. Booking ID: " +
            result.id,
            true
        );


        loadMyTestBookings();

    }
    catch (error) {

        console.error(
            error
        );


        showHospitalMessage(
            "Unable to book medical test: " +
            error.message,
            false
        );

    }

}


// =====================================================
// MY TEST BOOKINGS
// =====================================================

async function loadMyTestBookings() {

    if (!loggedInUser) {

        return;

    }


    const container =
        document.getElementById(
            "myTestBookings"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/test-bookings/user/" +
                loggedInUser.id
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load test bookings."
            );

        }


        const bookings =
            await response.json();


        displayMyTestBookings(
            bookings
        );

    }
    catch (error) {

        console.error(
            error
        );


        container.innerHTML = `

            <div class="dashboard-card">

                <p>
                    Unable to load test bookings.
                </p>

            </div>

        `;

    }

}


// =====================================================
// DISPLAY MY TEST BOOKINGS
// =====================================================

function displayMyTestBookings(
    bookings
) {

    const container =
        document.getElementById(
            "myTestBookings"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            bookings
        ) ||
        bookings.length === 0
    ) {

        container.innerHTML = `

            <div class="dashboard-card">

                <p>
                    No medical test bookings found.
                </p>

            </div>

        `;

        return;

    }


    bookings.forEach(
        function(booking) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "dashboard-card";


            card.innerHTML = `

                <h3>
                    Test Booking #${booking.id}
                </h3>


                <p>

                    <strong>
                        Hospital ID:
                    </strong>

                    ${booking.hospitalId ?? "N/A"}

                </p>


                <p>

                    <strong>
                        Medical Test ID:
                    </strong>

                    ${booking.medicalTestId ?? "N/A"}

                </p>


                <p>

                    <strong>
                        Date:
                    </strong>

                    ${escapeHTML(
                        booking.bookingDate ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Time:
                    </strong>

                    ${escapeHTML(
                        booking.bookingTime ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Status:
                    </strong>

                    ${escapeHTML(
                        booking.status ||
                        "PENDING"
                    )}

                </p>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// HOSPITAL MESSAGE
// =====================================================

function showHospitalMessage(
    message,
    success
) {

    const container =
        document.getElementById(
            "hospitalMessage"
        );


    if (!container) {

        alert(
            message
        );

        return;

    }


    container.textContent =
        message;


    container.style.color =
        success
            ? "#15803d"
            : "#dc2626";

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(
        value ?? ""
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
// ESCAPE QUOTES
// =====================================================

function escapeQuotes(value) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadHospitals();

        loadMyTestBookings();

    }
);