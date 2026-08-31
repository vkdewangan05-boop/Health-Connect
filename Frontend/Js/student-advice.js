// =====================================================
// HEALTHCONNECT
// PATIENT -> MEDICAL STUDENT GUIDANCE
// =====================================================

const API_URL =
    "http://localhost:8080";


// =====================================================
// LOGGED-IN USER
// =====================================================

const storedUser =
    localStorage.getItem("loggedInUser");

let loggedInUser = null;


if (storedUser) {

    try {

        loggedInUser =
            JSON.parse(storedUser);

    } catch(error) {

        console.error(
            "Unable to read user:",
            error
        );

    }

}


// =====================================================
// LOGIN CHECK
// =====================================================

if (!loggedInUser) {

    alert(
        "Please login first."
    );

    window.location.href =
        "../login.html";
}


// =====================================================
// SUBMIT GUIDANCE REQUEST
// =====================================================

document
    .getElementById("adviceForm")
    ?.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const problem =
                document.getElementById(
                    "problem"
                ).value.trim();


            const adviceType =
                document.getElementById(
                    "adviceType"
                ).value;


            const message =
                document.getElementById(
                    "message"
                );


            if (!problem) {

                message.textContent =
                    "Please describe your problem.";

                message.style.color =
                    "red";

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
                                    requestData
                                )

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to submit request."
                    );

                }


                await response.json();


                message.textContent =
                    "Guidance request submitted successfully.";

                message.style.color =
                    "green";


                document
                    .getElementById(
                        "adviceForm"
                    )
                    .reset();


                loadMyAdvice();

            }

            catch(error) {

                console.error(error);


                message.textContent =
                    "Unable to submit request.";

                message.style.color =
                    "red";

            }

        }
    );


// =====================================================
// LOAD PATIENT REQUESTS
// =====================================================

async function loadMyAdvice() {

    if (!loggedInUser) {
        return;
    }


    const container =
        document.getElementById(
            "myAdviceContainer"
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
            !Array.isArray(requests) ||
            requests.length === 0
        ) {

            container.innerHTML = `

                <div class="dashboard-card">

                    <p>
                        No guidance requests found.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


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
                            Student:
                        </strong>
                        ${escapeHTML(
                            request.studentName ||
                            "Not assigned yet"
                        )}
                    </p>

                    <p>
                        <strong>
                            Guidance:
                        </strong>
                        ${escapeHTML(
                            request.advice ||
                            "Waiting for guidance..."
                        )}
                    </p>

                    <p>
                        <strong>
                            Type:
                        </strong>
                        ${escapeHTML(
                            request.adviceType ||
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

    catch(error) {

        console.error(error);


        container.innerHTML = `

            <div class="dashboard-card">

                <p style="color:red;">
                    Unable to load requests.
                </p>

            </div>

        `;

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
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadMyAdvice();

    }
);