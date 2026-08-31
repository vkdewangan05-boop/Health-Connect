// =====================================================
// HEALTHCONNECT AUTHENTICATION HELPER
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
// API
// =====================================================

const API_URL =
    "http://localhost:8080";


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
// SUBMIT REQUEST
// =====================================================

const form =
    document.getElementById(
        "studentAssistanceForm"
    );


if (form) {

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "message"
                );


            const problemInput =
                document.getElementById(
                    "problem"
                );


            const adviceTypeInput =
                document.getElementById(
                    "adviceType"
                );


            const problem =
                problemInput
                    ? problemInput.value.trim()
                    : "";


            const adviceType =
                adviceTypeInput
                    ? adviceTypeInput.value
                    : "GENERAL_GUIDANCE";


            if (!problem) {

                if (message) {

                    message.textContent =
                        "Please describe your problem.";

                    message.style.color =
                        "red";

                }

                return;

            }


            const requestData = {

                studentId:
                    null,

                userId:
                    loggedInUser.id,

                studentName:
                    null,

                problem:
                    problem,

                advice:
                    null,

                adviceType:
                    adviceType,

                status:
                    "PENDING",

                createdDate:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            };


            try {

                if (message) {

                    message.textContent =
                        "Submitting request...";

                    message.style.color =
                        "#2563eb";

                }


                const response =
                    await hcAuthenticatedFetch(
                        API_URL +
                        "/api/student-advice",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    requestData
                                )

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to submit request."
                    );

                }


                if (message) {

                    message.textContent =
                        "Request submitted successfully.";

                    message.style.color =
                        "green";

                }


                form.reset();


                loadMyAssistance();

            }
            catch (error) {

                console.error(
                    "Student Assistance Error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message ||
                        "Unable to submit request.";

                    message.style.color =
                        "red";

                }

            }

        }
    );

}


// =====================================================
// LOAD USER REQUESTS
// =====================================================

async function loadMyAssistance() {

    if (!loggedInUser) {

        return;

    }


    const container =
        document.getElementById(
            "requestContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "<p>Loading requests...</p>";


    try {

        const response =
            await hcAuthenticatedFetch(
                API_URL +
                "/api/student-advice/user/" +
                loggedInUser.id
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load requests."
            );

        }


        const requests =
            await response.json();


        if (
            !Array.isArray(
                requests
            ) ||
            requests.length === 0
        ) {

            container.innerHTML = `

                <div class="dashboard-card">

                    <p>
                        You have not submitted
                        any student assistance requests yet.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            "";


        requests.forEach(
            function(request) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "dashboard-card";


                card.style.marginTop =
                    "15px";


                card.innerHTML = `

                    <h3>
                        Request #${request.id}
                    </h3>


                    <p>

                        <strong>
                            Problem:
                        </strong>

                        ${escapeHTML(
                            request.problem ||
                            "N/A"
                        )}

                    </p>


                    <p>

                        <strong>
                            Guidance Type:
                        </strong>

                        ${escapeHTML(
                            request.adviceType ||
                            "GENERAL_GUIDANCE"
                        )}

                    </p>


                    <p>

                        <strong>
                            Student:
                        </strong>

                        ${escapeHTML(
                            request.studentName ||
                            "Waiting for available medical student"
                        )}

                    </p>


                    <p>

                        <strong>
                            Advice:
                        </strong>

                        ${escapeHTML(
                            request.advice ||
                            "Advice not provided yet."
                        )}

                    </p>


                    <p>

                        <strong>
                            Status:
                        </strong>

                        ${escapeHTML(
                            request.status ||
                            "PENDING"
                        )}

                    </p>


                    <p>

                        <strong>
                            Date:
                        </strong>

                        ${escapeHTML(
                            request.createdDate ||
                            "N/A"
                        )}

                    </p>

                `;


                container.appendChild(
                    card
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Student Assistance Load Error:",
            error
        );


        container.innerHTML = `

            <div class="dashboard-card">

                <p style="color:red;">

                    Unable to load student
                    assistance requests.

                </p>

            </div>

        `;

    }

}


// =====================================================
// HTML SAFETY
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
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadMyAssistance();

    }
);