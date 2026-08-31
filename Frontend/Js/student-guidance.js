// =====================================================
// HEALTHCONNECT
// STUDENT GUIDANCE
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
            "Unable to read student:",
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
// LOAD REQUESTS
// =====================================================

async function loadGuidanceRequests() {

    const container =
        document.getElementById(
            "guidanceContainer"
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
                "/api/student-guidance/pending"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load guidance requests."
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

                    <h3>
                        No Pending Requests
                    </h3>

                    <p>
                        There are currently no patient
                        guidance requests.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        requests.forEach(function(request) {

            const card =
                document.createElement("div");


            card.className =
                "dashboard-card";


            card.style.marginTop =
                "15px";


            card.innerHTML = `

                <h3>
                    Patient Request #${request.id}
                </h3>

                <p>
                    <strong>
                        Patient ID:
                    </strong>
                    ${request.userId ?? "N/A"}
                </p>

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
                        Status:
                    </strong>
                    ${escapeHTML(
                        request.status ||
                        "PENDING"
                    )}
                </p>

                <button
                    class="dashboard-btn"
                    onclick="provideGuidance(
                        ${request.id},
                        ${request.userId}
                    )">

                    Provide Guidance

                </button>

            `;


            container.appendChild(card);

        });

    }

    catch(error) {

        console.error(error);

        container.innerHTML = `

            <div class="dashboard-card">

                <p style="color:red;">
                    Unable to load guidance requests.
                </p>

            </div>

        `;

    }

}


// =====================================================
// PROVIDE GUIDANCE
// =====================================================

async function provideGuidance(
    requestId,
    userId
) {

    if (!loggedInStudent) {
        return;
    }


    const advice =
        prompt(
            "Enter basic health guidance / first-aid advice:"
        );


    if (
        !advice ||
        advice.trim() === ""
    ) {

        return;

    }


    const guidance = {

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
                "/api/student-guidance",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            guidance
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to submit guidance."
            );

        }


        await response.json();


        alert(
            "Guidance submitted successfully."
        );


        loadGuidanceRequests();

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

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
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

        loadGuidanceRequests();

    }
);