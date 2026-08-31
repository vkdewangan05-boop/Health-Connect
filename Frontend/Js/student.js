// =====================================================
// HEALTHCONNECT
// MEDICAL STUDENT MODULE
// =====================================================

const API_URL =
    "http://localhost:8080";


// =====================================================
// LOGGED-IN STUDENT
// =====================================================

const storedStudent =
    localStorage.getItem("loggedInStudent");

let loggedInStudent = null;


if (storedStudent) {

    try {

        loggedInStudent =
            JSON.parse(storedStudent);

    } catch (error) {

        console.error(
            "Unable to read student data:",
            error
        );

    }

}


// =====================================================
// LOGIN CHECK
// =====================================================

if (!loggedInStudent) {

    alert(
        "Please login as a medical student."
    );

    window.location.href =
        "../login.html";
}


// =====================================================
// SHOW PROFILE
// =====================================================

function loadStudentProfile() {

    if (!loggedInStudent) {
        return;
    }


    const info =
        document.getElementById(
            "studentInfo"
        );


    const profile =
        document.getElementById(
            "profile"
        );


    if (info) {

        info.textContent =
            "Student: " +
            (
                loggedInStudent.fullName ||
                "Medical Student"
            ) +
            " | Student ID: " +
            (
                loggedInStudent.id ||
                "N/A"
            );

    }


    if (profile) {

        profile.innerHTML = `

            <p>
                <strong>Name:</strong>
                ${escapeHTML(
                    loggedInStudent.fullName ||
                    "N/A"
                )}
            </p>

            <p>
                <strong>Student ID:</strong>
                ${loggedInStudent.id || "N/A"}
            </p>

            <p>
                <strong>College:</strong>
                ${escapeHTML(
                    loggedInStudent.collegeName ||
                    "N/A"
                )}
            </p>

            <p>
                <strong>Qualification:</strong>
                ${escapeHTML(
                    loggedInStudent.qualification ||
                    "N/A"
                )}
            </p>

            <p>
                <strong>Year:</strong>
                ${loggedInStudent.year || "N/A"}
            </p>

            <p>
                <strong>Availability:</strong>
                ${
                    loggedInStudent.available
                        ? "Available"
                        : "Not Available"
                }
            </p>

        `;

    }

}


// =====================================================
// LOAD PATIENT REQUESTS
// =====================================================

async function loadStudentRequests() {

    if (!loggedInStudent) {
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
            await fetch(
                API_URL +
                "/api/student-advice/pending"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load requests."
            );

        }


        const requests =
            await response.json();


        if (
            !Array.isArray(requests) ||
            requests.length === 0
        ) {

            container.innerHTML = `

                <div class="dashboard-card">

                    <p>
                        No pending patient requests.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        requests.forEach(function(request) {

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
                    Patient Request #${request.id}
                </h3>

                <p>
                    <strong>Patient ID:</strong>
                    ${request.userId}
                </p>

                <p>
                    <strong>Problem:</strong>
                    ${escapeHTML(
                        request.problem ||
                        "N/A"
                    )}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(
                        request.status ||
                        "PENDING"
                    )}
                </p>

                <div style="margin-top:15px;">

                    <button
                        class="dashboard-btn"
                        onclick="provideAdvice(
                            ${request.id},
                            ${request.userId}
                        )">

                        Provide Guidance

                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        });

    }

    catch(error) {

        console.error(error);

        container.innerHTML = `

            <div class="dashboard-card">

                <p style="color:red;">

                    Unable to load patient requests.

                </p>

            </div>

        `;

    }

}


// =====================================================
// PROVIDE ADVICE
// =====================================================

async function provideAdvice(
    requestId,
    userId
) {

    const advice =
        prompt(
            "Enter basic health guidance / first-aid advice:"
        );


    if (!advice ||
        advice.trim() === "") {

        return;

    }


    const adviceData = {

        studentId:
            loggedInStudent.id,

        userId:
            userId,

        studentName:
            loggedInStudent.fullName,

        problem:
            "Patient guidance request #" +
            requestId,

        advice:
            advice,

        adviceType:
            "GENERAL_GUIDANCE",

        status:
            "SUBMITTED",

        createdDate:
            new Date()
                .toISOString()
                .split("T")[0]

    };


    try {

        const response =
            await fetch(
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
                            adviceData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to submit advice."
            );

        }


        await response.json();


        alert(
            "Guidance submitted successfully."
        );


        loadStudentRequests();

    }

    catch(error) {

        console.error(error);

        alert(
            "Unable to submit guidance."
        );

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

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


// =====================================================
// LOGOUT
// =====================================================

function logoutStudent() {

    localStorage.removeItem(
        "loggedInStudent"
    );

    window.location.href =
        "../login.html";
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadStudentProfile();

        loadStudentRequests();

    }
);