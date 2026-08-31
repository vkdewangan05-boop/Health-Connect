// =====================================================
// HEALTHCONNECT
// DOCTOR PATIENT MANAGEMENT
// =====================================================

const PATIENT_API_BASE =
    "http://localhost:8080";


// =====================================================
// GET CURRENT DOCTOR
// =====================================================

function getCurrentDoctor() {

    const keys = [
        "loggedInDoctor",
        "doctor",
        "loggedInUser"
    ];


    for (const key of keys) {

        const stored =
            localStorage.getItem(
                key
            );


        if (!stored) {
            continue;
        }


        try {

            const doctor =
                JSON.parse(
                    stored
                );


            const role =
                String(
                    doctor.role || "DOCTOR"
                )
                .trim()
                .toUpperCase();


            if (
                key === "loggedInUser" &&
                role !== "DOCTOR"
            ) {

                continue;
            }


            if (
                doctor &&
                (
                    doctor.id ||
                    doctor.doctorId
                )
            ) {

                return doctor;
            }

        }

        catch (error) {

            console.error(
                "Doctor storage error:",
                error
            );
        }
    }


    return null;
}


// =====================================================
// GET DOCTOR TOKEN
// =====================================================

function getDoctorPatientToken() {

    const doctor =
        getCurrentDoctor();


    if (doctor) {

        const token =
            doctor.token ||
            doctor.jwt ||
            doctor.accessToken ||
            doctor.authToken ||
            doctor.jwtToken;


        if (
            token &&
            String(token).trim() !== ""
        ) {

            return String(
                token
            ).trim();
        }
    }


    const doctorToken =
        localStorage.getItem(
            "doctorToken"
        );


    if (
        doctorToken &&
        doctorToken.trim() !== ""
    ) {

        return doctorToken.trim();
    }


    return null;
}


// =====================================================
// AUTHENTICATED FETCH
// =====================================================

async function doctorPatientFetch(
    url,
    options = {}
) {

    const token =
        getDoctorPatientToken();


    if (!token) {

        throw new Error(
            "Doctor JWT token not found. Please login again."
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


    const response =
        await fetch(
            url,
            requestOptions
        );


    if (
        response.status === 401
    ) {

        throw new Error(
            "Doctor authentication failed. Please login again."
        );
    }


    if (
        response.status === 403
    ) {

        throw new Error(
            "Doctor is not authorized to view patients."
        );
    }


    return response;
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapePatientHTML(
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
// LOAD DOCTOR PATIENTS
// =====================================================

async function loadDoctorPatients() {

    const table =
        document.getElementById(
            "patientTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td
                colspan="7"
                style="
                    text-align:center;
                    padding:20px;
                ">
                Loading patients...
            </td>
        </tr>
    `;


    const doctor =
        getCurrentDoctor();


    if (!doctor) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:20px;
                        color:#dc2626;
                    ">
                    Doctor login information
                    was not found.
                </td>
            </tr>
        `;

        return;
    }


    const doctorId =
        Number(
            doctor.id ??
            doctor.doctorId
        );


    if (
        !Number.isInteger(doctorId) ||
        doctorId <= 0
    ) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:20px;
                        color:#dc2626;
                    ">
                    Doctor ID is not available.
                </td>
            </tr>
        `;

        return;
    }


    try {

        const response =
            await doctorPatientFetch(

                PATIENT_API_BASE +
                "/api/consultations/doctor/" +
                doctorId
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Unable to load doctor consultations."
            );
        }


        let consultations;


        try {

            consultations =
                JSON.parse(
                    responseText
                );

        }

        catch (error) {

            throw new Error(
                "Invalid consultation data received."
            );
        }


        if (
            !Array.isArray(
                consultations
            )
        ) {

            throw new Error(
                "Invalid consultation data received."
            );
        }


        // =================================================
        // ONLY ACCEPTED CONSULTATIONS
        // ARE DOCTOR'S PATIENTS
        // =================================================

        const acceptedConsultations =
            consultations.filter(
                function(consultation) {

                    return String(
                        consultation.status || ""
                    )
                        .trim()
                        .toUpperCase()
                        === "ACCEPTED";
                }
            );


        table.innerHTML = "";


        if (
            acceptedConsultations.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        style="
                            text-align:center;
                            padding:25px;
                            color:#6b7280;
                        ">
                        No accepted patients yet.
                    </td>
                </tr>
            `;

            return;
        }


        acceptedConsultations.forEach(
            function(consultation) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const patientId =
                    consultation.patientId ??
                    "-";


                const patientName =
                    consultation.patientUsername ||
                    "Patient";


                const consultationId =
                    consultation.id ??
                    "-";


                const status =
                    consultation.status ||
                    "ACCEPTED";


                const doctorName =
                    doctor.fullName ||
                    doctor.username ||
                    "Doctor";


                row.innerHTML = `

                    <td>
                        ${escapePatientHTML(
                            patientId
                        )}
                    </td>

                    <td>
                        ${escapePatientHTML(
                            patientName
                        )}
                    </td>

                    <td>
                        ${escapePatientHTML(
                            patientName
                        )}
                    </td>

                    <td>
                        ${escapePatientHTML(
                            "Available in patient profile"
                        )}
                    </td>

                    <td>
                        ${escapePatientHTML(
                            doctorName
                        )}
                    </td>

                    <td>
                        ${escapePatientHTML(
                            consultationId
                        )}
                    </td>

                    <td>
                        <span
                            style="
                                color:#16a34a;
                                font-weight:bold;
                            ">
                            ${escapePatientHTML(
                                status
                            )}
                        </span>
                    </td>

                `;


                table.appendChild(
                    row
                );
            }
        );

    }

    catch (error) {

        console.error(
            "Doctor Patient Error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#dc2626;
                    ">

                    Unable to load patients.

                    <br>

                    <small>
                        ${escapePatientHTML(
                            error.message
                        )}
                    </small>

                </td>
            </tr>
        `;
    }
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorPatients();

    }
);


// =====================================================
// GLOBAL EXPORT
// =====================================================

window.loadDoctorPatients =
    loadDoctorPatients;