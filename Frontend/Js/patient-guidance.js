// =====================================================
// HEALTHCONNECT
// PATIENT GUIDANCE
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
// LOAD GUIDANCE
// =====================================================

async function loadPatientGuidance() {

    if (!loggedInUser) {
        return;
    }


    const container =
        document.getElementById(
            "guidanceContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading guidance...</p>";


    try {

        const response =
            await fetch(
                API_URL +
                "/api/student-guidance/user/" +
                loggedInUser.id
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load guidance."
            );

        }


        const guidanceList =
            await response.json();


        if (
            !Array.isArray(guidanceList) ||
            guidanceList.length === 0
        ) {

            container.innerHTML = `

                <div class="dashboard-card">

                    <h3>
                        No Guidance Available
                    </h3>

                    <p>
                        You have not received any
                        student guidance yet.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        guidanceList.forEach(
            function(item) {

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
                        Guidance #${item.id}
                    </h3>

                    <p>
                        <strong>
                            Student:
                        </strong>
                        ${escapeHTML(
                            item.studentName ||
                            "Medical Student"
                        )}
                    </p>

                    <p>
                        <strong>
                            Problem:
                        </strong>
                        ${escapeHTML(
                            item.problem ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        <strong>
                            Guidance:
                        </strong>
                        ${escapeHTML(
                            item.advice ||
                            "No guidance provided."
                        )}
                    </p>

                    <p>
                        <strong>
                            Guidance Type:
                        </strong>
                        ${escapeHTML(
                            item.adviceType ||
                            "GENERAL_GUIDANCE"
                        )}
                    </p>

                    <p>
                        <strong>
                            Date:
                        </strong>
                        ${escapeHTML(
                            item.createdDate ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>
                        ${escapeHTML(
                            item.status ||
                            "N/A"
                        )}
                    </p>

                `;


                container.appendChild(card);

            }
        );

    }

    catch(error) {

        console.error(error);

        container.innerHTML = `

            <div class="dashboard-card">

                <h3>
                    Unable to Load Guidance
                </h3>

                <p style="color:red;">
                    ${escapeHTML(
                        error.message
                    )}
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

        loadPatientGuidance();

    }
);