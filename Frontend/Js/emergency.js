// =====================================================
// HEALTHCONNECT
// EMERGENCY SERVICE
// GOVERNMENT HELPLINES + HOSPITAL INFORMATION
// =====================================================


// =====================================================
// API
// =====================================================

const EMERGENCY_API_URL =
    "http://localhost:8080";


// =====================================================
// AUTHENTICATION
// =====================================================

function emergencyGetAuthToken() {

    if (
        typeof getUserAuthToken === "function"
    ) {

        const token =
            getUserAuthToken();

        if (token) {

            return token;

        }

    }


    const tokenKeys = [

        "authToken",
        "token",
        "jwt",
        "accessToken"

    ];


    for (
        const key of tokenKeys
    ) {

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


    return null;

}


// =====================================================
// AUTHENTICATED FETCH
// =====================================================

async function emergencyAuthenticatedFetch(
    url,
    options = {}
) {

    const token =
        emergencyGetAuthToken();


    if (!token) {

        alert(
            "Your login session has expired. Please login again."
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

        ...(options.headers || {}),

        "Authorization":
            "Bearer " + token

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


    const response =
        await fetch(
            url,
            requestOptions
        );


    if (
        response.status === 401
    ) {

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
            "authToken"
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
            "Unauthorized request."
        );

    }


    return response;

}


// =====================================================
// ESCAPE HTML
// =====================================================

function emergencyEscapeHTML(
    value
) {

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
// HOSPITAL DATA
// =====================================================

let emergencyAllHospitals = [];


// =====================================================
// LOAD GOVERNMENT HOSPITALS
// =====================================================

async function loadGovernmentHospitals() {

    const container =
        document.getElementById(
            "emergencyHospitalContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <p class="loading-message">

            Loading government hospitals...

        </p>

    `;


    try {

        const response =
            await emergencyAuthenticatedFetch(
                EMERGENCY_API_URL +
                "/api/hospitals"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load hospitals."
            );

        }


        const hospitals =
            await response.json();


        emergencyAllHospitals =
            Array.isArray(
                hospitals
            )
                ? hospitals
                : [];


        const governmentHospitals =
            emergencyAllHospitals.filter(
                function(hospital) {

                    const type =
                        String(
                            hospital.type ||
                            hospital.hospitalType ||
                            ""
                        )
                        .trim()
                        .toLowerCase();


                    return (
                        type === "government" ||
                        type === "govt" ||
                        type === "gov"
                    );

                }
            );


        displayEmergencyHospitals(
            governmentHospitals
        );

    }
    catch (error) {

        console.error(
            "Emergency hospital API error:",
            error
        );


        container.innerHTML = `

            <div class="error-message">

                Unable to load government hospitals.

                <br><br>

                ${emergencyEscapeHTML(
                    error.message
                )}

            </div>

        `;

    }

}


// =====================================================
// DISPLAY HOSPITALS
// =====================================================

function displayEmergencyHospitals(
    hospitals
) {

    const container =
        document.getElementById(
            "emergencyHospitalContainer"
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

            <div class="empty-message">

                No government hospitals found
                for the selected location.

            </div>

        `;

        return;

    }


    hospitals.forEach(
        function(hospital) {


            // -------------------------------------------------
            // HOSPITAL NAME
            // -------------------------------------------------

            const hospitalName =
                hospital.name ||
                hospital.hospitalName ||
                "Government Hospital";


            // -------------------------------------------------
            // DATABASE ID
            // -------------------------------------------------

            const hospitalId =
                hospital.id ||
                null;


            // -------------------------------------------------
            // HOSPITAL DISPLAY ID
            // -------------------------------------------------

            const hospitalDisplayId =
                hospital.hospitalId ||
                hospital.id ||
                "N/A";


            // -------------------------------------------------
            // LOCATION
            // -------------------------------------------------

            const location =
                hospital.location ||
                hospital.address ||
                "N/A";


            // -------------------------------------------------
            // EMERGENCY CONTACT
            // -------------------------------------------------

            const emergencyContact =
                hospital.emergencyContact ||
                hospital.emergencyNumber ||
                hospital.phone ||
                "N/A";


            // -------------------------------------------------
            // FACILITIES
            // -------------------------------------------------

            const facilities =
                hospital.facilities ||
                hospital.hospitalFacilities ||
                "N/A";


            // -------------------------------------------------
            // AVAILABILITY
            // -------------------------------------------------

            const available =
                hospital.available === true ||
                String(
                    hospital.available
                ).toLowerCase() ===
                "true"
                    ? "Available"
                    : "Not Available";


            // -------------------------------------------------
            // CREATE CARD
            // -------------------------------------------------

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "hospital-result-card";


            // -------------------------------------------------
            // CARD CONTENT
            // -------------------------------------------------

            card.innerHTML = `

                <h3>

                    🏥
                    ${emergencyEscapeHTML(
                        hospitalName
                    )}

                </h3>


                <p>

                    <strong>
                        Hospital ID:
                    </strong>

                    ${emergencyEscapeHTML(
                        hospitalDisplayId
                    )}

                </p>


                <p>

                    <strong>
                        Location:
                    </strong>

                    ${emergencyEscapeHTML(
                        location
                    )}

                </p>


                <p>

                    <strong>
                        Hospital Type:
                    </strong>

                    Government

                </p>


                <p>

                    <strong>
                        Emergency Contact:
                    </strong>

                    ${emergencyEscapeHTML(
                        emergencyContact
                    )}

                </p>


                <p>

                    <strong>
                        Facilities:
                    </strong>

                    ${emergencyEscapeHTML(
                        facilities
                    )}

                </p>


                <p>

                    <strong>
                        Availability:
                    </strong>

                    ${emergencyEscapeHTML(
                        available
                    )}

                </p>


                <div
                    class="hospital-result-actions">


                    <!-- CALL HOSPITAL -->

                    ${
                        emergencyContact !==
                        "N/A"

                            ?

                        `

                        <a
                            href="tel:${emergencyEscapeHTML(
                                emergencyContact
                            )}"
                            class="hospital-link-btn">

                            📞 Call Hospital

                        </a>

                        `

                            :

                        ""

                    }


                    <!-- VIEW HOSPITAL -->

                    ${
                        hospitalId !== null

                            ?

                        `

                        <button
                            type="button"
                            class="hospital-link-btn"
                            onclick="viewEmergencyHospital(
                                ${Number(hospitalId)}
                            )">

                            🏥 View Hospital

                        </button>

                        `

                            :

                        ""

                    }


                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// VIEW SELECTED HOSPITAL
// =====================================================
// IMPORTANT:
// View Hospital from Emergency page will NOT open
// hospital-finder.html.
//
// It will fetch the selected hospital using its ID
// and then open hospital-information.html.
// =====================================================

async function viewEmergencyHospital(
    hospitalId
) {

    if (
        !hospitalId ||
        Number(hospitalId) <= 0
    ) {

        alert(
            "Hospital information is unavailable."
        );

        return;

    }


    try {

        // -------------------------------------------------
        // GET SELECTED HOSPITAL DETAILS
        // -------------------------------------------------

        const response =
            await emergencyAuthenticatedFetch(
                EMERGENCY_API_URL +
                "/api/hospitals/" +
                hospitalId
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load hospital information."
            );

        }


        const hospital =
            await response.json();


        if (
            !hospital
        ) {

            throw new Error(
                "Hospital information was not received."
            );

        }


        // -------------------------------------------------
        // SAVE SELECTED HOSPITAL
        // -------------------------------------------------

        localStorage.setItem(
            "selectedEmergencyHospital",
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
// SEARCH HOSPITALS BY LOCATION
// =====================================================

function searchEmergencyHospitals() {

    const input =
        document.getElementById(
            "emergencyLocationSearch"
        );


    if (!input) {

        return;

    }


    const location =
        input.value
            .trim()
            .toLowerCase();


    if (!location) {

        alert(
            "Please enter a city or location."
        );

        return;

    }


    const governmentHospitals =
        emergencyAllHospitals.filter(
            function(hospital) {

                const type =
                    String(
                        hospital.type ||
                        hospital.hospitalType ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                const hospitalLocation =
                    String(
                        hospital.location ||
                        hospital.address ||
                        ""
                    )
                    .toLowerCase();


                const isGovernment =
                    type === "government" ||
                    type === "govt" ||
                    type === "gov";


                const locationMatch =
                    hospitalLocation.includes(
                        location
                    );


                return (
                    isGovernment &&
                    locationMatch
                );

            }
        );


    displayEmergencyHospitals(
        governmentHospitals
    );

}


// =====================================================
// SHOW ALL GOVERNMENT HOSPITALS
// =====================================================

function showAllGovernmentHospitals() {

    const governmentHospitals =
        emergencyAllHospitals.filter(
            function(hospital) {

                const type =
                    String(
                        hospital.type ||
                        hospital.hospitalType ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                return (
                    type === "government" ||
                    type === "govt" ||
                    type === "gov"
                );

            }
        );


    displayEmergencyHospitals(
        governmentHospitals
    );

}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "HealthConnect Emergency Service loaded."
        );


        /*
         * Login is already checked by user.js.
         * We only load the hospital list here.
         */

        loadGovernmentHospitals();

    }
);


// =====================================================
// GLOBAL FUNCTIONS
// =====================================================

window.searchEmergencyHospitals =
    searchEmergencyHospitals;


window.showAllGovernmentHospitals =
    showAllGovernmentHospitals;


window.loadGovernmentHospitals =
    loadGovernmentHospitals;


window.viewEmergencyHospital =
    viewEmergencyHospital;