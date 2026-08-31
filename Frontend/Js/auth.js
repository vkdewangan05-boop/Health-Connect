// =====================================================
// HEALTHCONNECT
// AUTHENTICATION JAVASCRIPT
// =====================================================


// =====================================================
// API URLS
// =====================================================

const USER_API_URL =
    "http://localhost:8080/api/users";

const DOCTOR_API_URL =
    "http://localhost:8080/api/doctors";

const STUDENT_API_URL =
    "http://localhost:8080/api/students";

const HOSPITAL_API_URL =
    "http://localhost:8080/api/hospitals";


// =====================================================
// TOKEN STORAGE KEY
// =====================================================

const AUTH_TOKEN_KEY =
    "authToken";


console.log(
    "HealthConnect Authentication Loaded"
);


// =====================================================
// LOGIN FORM
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const usernameElement =
                document.getElementById("username");

            const passwordElement =
                document.getElementById("password");

            const loginMessage =
                document.getElementById("loginMessage");

            const loginButton =
                document.getElementById("loginButton");


            const username =
                usernameElement
                    ? usernameElement.value.trim()
                    : "";

            const password =
                passwordElement
                    ? passwordElement.value
                    : "";


            // =================================================
            // VALIDATION
            // =================================================

            if (
                username === "" ||
                password === ""
            ) {

                if (loginMessage) {

                    loginMessage.textContent =
                        "Please enter username and password.";

                    loginMessage.style.color =
                        "#dc2626";

                }

                return;

            }


            // =================================================
            // LOGIN START
            // =================================================

            if (loginMessage) {

                loginMessage.textContent =
                    "Logging in...";

                loginMessage.style.color =
                    "#2563eb";

            }


            if (loginButton) {

                loginButton.disabled =
                    true;

                loginButton.textContent =
                    "Logging in...";

            }


            try {


                // =================================================
                // 1. STUDENT LOGIN
                // =================================================

                try {

                    const studentResponse =
                        await fetch(
                            `${STUDENT_API_URL}/login`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        username:
                                            username,

                                        password:
                                            password
                                    })
                            }
                        );


                    const studentData =
                        await readResponse(
                            studentResponse
                        );


                    console.log(
                        "Student Login Status:",
                        studentResponse.status
                    );


                    if (
                        studentResponse.ok
                    ) {

                        clearLoginStorage();


                        saveAuthentication(
                            studentData,
                            "STUDENT"
                        );


                        localStorage.setItem(
                            "loggedInStudent",
                            JSON.stringify(
                                studentData
                            )
                        );


                        if (loginMessage) {

                            loginMessage.textContent =
                                "Student login successful!";

                            loginMessage.style.color =
                                "#16a34a";

                        }


                        setTimeout(
                            function () {

                                window.location.href =
                                    "Student/student-dashboard.html";

                            },
                            700
                        );


                        return;

                    }

                }

                catch (studentError) {

                    console.log(
                        "Student login not successful."
                    );

                }


                // =================================================
                // 2. HOSPITAL LOGIN
                // =================================================

                try {

                    const hospitalResponse =
                        await fetch(
                            `${HOSPITAL_API_URL}/login`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        username:
                                            username,

                                        password:
                                            password
                                    })
                            }
                        );


                    const hospitalData =
                        await readResponse(
                            hospitalResponse
                        );


                    console.log(
                        "Hospital Login Status:",
                        hospitalResponse.status
                    );


                    if (
                        hospitalResponse.ok
                    ) {

                        clearLoginStorage();


                        saveAuthentication(
                            hospitalData,
                            "HOSPITAL"
                        );


                        localStorage.setItem(
                            "loggedInHospital",
                            JSON.stringify(
                                hospitalData
                            )
                        );


                        localStorage.setItem(
                            "hospital",
                            JSON.stringify(
                                hospitalData
                            )
                        );


                        if (loginMessage) {

                            loginMessage.textContent =
                                "Hospital login successful!";

                            loginMessage.style.color =
                                "#16a34a";

                        }


                        setTimeout(
                            function () {

                                window.location.href =
                                    "Hospital/dashboard.html";

                            },
                            700
                        );


                        return;

                    }

                }

                catch (hospitalError) {

                    console.log(
                        "Hospital login not successful."
                    );

                }


                // =================================================
                // 3. NORMAL USER / DOCTOR LOGIN
                // =================================================

                const response =
                    await fetch(
                        `${USER_API_URL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    username:
                                        username,

                                    password:
                                        password
                                })
                        }
                    );


                const data =
                    await readResponse(
                        response
                    );


                console.log(
                    "User Login HTTP Status:",
                    response.status
                );


                console.log(
                    "User Login Backend Response:",
                    data
                );


                // =================================================
                // LOGIN FAILED
                // =================================================

                if (!response.ok) {

                    let errorMessage =
                        "Invalid username or password.";


                    if (
                        typeof data === "string" &&
                        data.trim() !== ""
                    ) {

                        errorMessage =
                            data;

                    }

                    else if (
                        data &&
                        data.message
                    ) {

                        errorMessage =
                            data.message;

                    }


                    if (loginMessage) {

                        loginMessage.textContent =
                            errorMessage;

                        loginMessage.style.color =
                            "#dc2626";

                    }


                    return;

                }


                // =================================================
                // GET ROLE
                // =================================================

                let role =
                    (
                        data.role ||
                        "USER"
                    )
                    .toString()
                    .trim()
                    .toUpperCase();


                if (
                    role.startsWith("ROLE_")
                ) {

                    role =
                        role.substring(5);

                }


                // =================================================
                // GET TOKEN
                // =================================================

                const token =
                    data &&
                    (
                        data.token ||
                        data.jwt ||
                        data.accessToken
                    )
                        ? String(
                            data.token ||
                            data.jwt ||
                            data.accessToken
                        ).trim()
                        : "";


                if (!token) {

                    console.error(
                        "JWT token missing:",
                        data
                    );


                    if (loginMessage) {

                        loginMessage.textContent =
                            "Login failed: JWT token was not received from backend.";

                        loginMessage.style.color =
                            "#dc2626";

                    }

                    return;

                }


                // =================================================
                // CLEAR OLD LOGIN
                // =================================================

                clearLoginStorage();


                // =================================================
                // NORMAL USER OBJECT
                // =================================================

                const loggedInUser = {

                    id:
                        data.id ??
                        data.userId ??
                        null,

                    fullName:
                        data.fullName ??
                        data.name ??
                        username,

                    email:
                        data.email ??
                        "",

                    mobile:
                        data.mobile ??
                        "",

                    username:
                        data.username ??
                        username,

                    role:
                        role,

                    token:
                        token

                };


                // =================================================
                // SAVE TOKEN
                // =================================================

                localStorage.setItem(
                    AUTH_TOKEN_KEY,
                    token
                );


                localStorage.setItem(
                    "token",
                    token
                );


                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                localStorage.setItem(
                    "userRole",
                    role
                );


                // =================================================
                // SAVE NORMAL USER
                // =================================================

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(
                        loggedInUser
                    )
                );


                // =================================================
                // DOCTOR LOGIN
                // =================================================

                if (
                    role === "DOCTOR"
                ) {

                    let completeDoctor =
                        null;


                    try {

                        const doctorResponse =
                            await fetch(
                                DOCTOR_API_URL,
                                {
                                    method: "GET",

                                    headers: {
                                        "Authorization":
                                            "Bearer " + token,

                                        "Content-Type":
                                            "application/json"
                                    }
                                }
                            );


                        console.log(
                            "Doctor Details HTTP Status:",
                            doctorResponse.status
                        );


                        if (
                            doctorResponse.ok
                        ) {

                            const doctors =
                                await doctorResponse.json();


                            if (
                                Array.isArray(
                                    doctors
                                )
                            ) {

                                completeDoctor =
                                    doctors.find(
                                        function (doctor) {

                                            const sameUsername =
                                                doctor.username &&
                                                loggedInUser.username &&
                                                doctor.username
                                                    .toString()
                                                    .trim()
                                                    .toLowerCase() ===
                                                loggedInUser.username
                                                    .toString()
                                                    .trim()
                                                    .toLowerCase();


                                            const sameEmail =
                                                doctor.email &&
                                                loggedInUser.email &&
                                                doctor.email
                                                    .toString()
                                                    .trim()
                                                    .toLowerCase() ===
                                                loggedInUser.email
                                                    .toString()
                                                    .trim()
                                                    .toLowerCase();


                                            const sameId =
                                                doctor.id &&
                                                loggedInUser.id &&
                                                String(
                                                    doctor.id
                                                ) ===
                                                String(
                                                    loggedInUser.id
                                                );


                                            return (
                                                sameUsername ||
                                                sameEmail ||
                                                sameId
                                            );

                                        }
                                    );

                            }

                        }

                    }

                    catch (doctorError) {

                        console.error(
                            "Unable to load complete doctor profile during login:",
                            doctorError
                        );

                    }


                    // =================================================
                    // IF COMPLETE DOCTOR FOUND
                    // =================================================

                    if (
                        completeDoctor
                    ) {

                        const doctorObject = {

                            ...completeDoctor,

                            role:
                                "DOCTOR",

                            token:
                                token

                        };


                        localStorage.setItem(
                            "doctor",
                            JSON.stringify(
                                doctorObject
                            )
                        );


                        localStorage.setItem(
                            "loggedInDoctor",
                            JSON.stringify(
                                doctorObject
                            )
                        );


                        localStorage.setItem(
                            "loggedInUser",
                            JSON.stringify(
                                doctorObject
                            )
                        );


                        console.log(
                            "Complete Doctor Profile Saved:",
                            doctorObject
                        );

                    }

                    else {

                        localStorage.setItem(
                            "doctor",
                            JSON.stringify(
                                loggedInUser
                            )
                        );


                        localStorage.setItem(
                            "loggedInDoctor",
                            JSON.stringify(
                                loggedInUser
                            )
                        );


                        console.warn(
                            "Complete doctor profile not found during login. Dashboard will try again."
                        );

                    }

                }


                // =================================================
                // HOSPITAL
                // =================================================

                else if (
                    role === "HOSPITAL"
                ) {

                    localStorage.setItem(
                        "hospital",
                        JSON.stringify(
                            loggedInUser
                        )
                    );


                    localStorage.setItem(
                        "loggedInHospital",
                        JSON.stringify(
                            loggedInUser
                        )
                    );

                }


                // =================================================
                // STUDENT
                // =================================================

                else if (
                    role === "STUDENT"
                ) {

                    localStorage.setItem(
                        "loggedInStudent",
                        JSON.stringify(
                            loggedInUser
                        )
                    );

                }


                // =================================================
                // LOGIN SUCCESS
                // =================================================

                if (loginMessage) {

                    loginMessage.textContent =
                        "Login successful!";

                    loginMessage.style.color =
                        "#16a34a";

                }


                // =================================================
                // REDIRECT
                // =================================================

                setTimeout(
                    function () {

                        if (
                            role === "STUDENT"
                        ) {

                            window.location.href =
                                "Student/student-dashboard.html";

                        }

                        else if (
                            role === "DOCTOR"
                        ) {

                            window.location.href =
                                "Doctor/doctor-dashboard.html";

                        }

                        else if (
                            role === "HOSPITAL"
                        ) {

                            window.location.href =
                                "Hospital/dashboard.html";

                        }

                        else if (
                            role === "ADMIN"
                        ) {

                            window.location.href =
                                "dashboard/admin-dashboard.html";

                        }

                        else {

                            window.location.href =
                                "User/dashboard.html";

                        }

                    },
                    700
                );

            }

            catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        "Failed to connect with backend. Please make sure the backend server is running.";

                    loginMessage.style.color =
                        "#dc2626";

                }

            }

            finally {

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Login";

                }

            }

        }
    );

}


// =====================================================
// SAVE AUTHENTICATION
// =====================================================

function saveAuthentication(
    data,
    role
) {

    if (!data) {

        return;

    }


    let token =
        data.token ||
        data.jwt ||
        data.accessToken ||
        "";


    token =
        String(token).trim();


    if (token) {

        localStorage.setItem(
            AUTH_TOKEN_KEY,
            token
        );


        localStorage.setItem(
            "token",
            token
        );

    }


    let normalizedRole =
        (
            data.role ||
            role ||
            "USER"
        )
        .toString()
        .trim()
        .toUpperCase();


    if (
        normalizedRole.startsWith("ROLE_")
    ) {

        normalizedRole =
            normalizedRole.substring(5);

    }


    const userObject = {

        ...data,

        id:
            data.id ??
            data.userId ??
            null,

        username:
            data.username ??
            "",

        fullName:
            data.fullName ??
            data.name ??
            data.username ??
            "",

        role:
            normalizedRole,

        token:
            token

    };


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(
            userObject
        )
    );


    localStorage.setItem(
        "isLoggedIn",
        "true"
    );


    localStorage.setItem(
        "userRole",
        normalizedRole
    );


    if (
        normalizedRole === "STUDENT"
    ) {

        localStorage.setItem(
            "loggedInStudent",
            JSON.stringify(
                userObject
            )
        );

    }


    else if (
        normalizedRole === "HOSPITAL"
    ) {

        localStorage.setItem(
            "loggedInHospital",
            JSON.stringify(
                userObject
            )
        );


        localStorage.setItem(
            "hospital",
            JSON.stringify(
                userObject
            )
        );

    }


    else if (
        normalizedRole === "DOCTOR"
    ) {

        localStorage.setItem(
            "loggedInDoctor",
            JSON.stringify(
                userObject
            )
        );


        localStorage.setItem(
            "doctor",
            JSON.stringify(
                userObject
            )
        );

    }

}


// =====================================================
// GET AUTH TOKEN
// =====================================================

function getAuthToken() {

    const authToken =
        localStorage.getItem(
            AUTH_TOKEN_KEY
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
// AUTHENTICATED FETCH
// =====================================================

async function authenticatedFetch(
    url,
    options = {}
) {

    const token =
        getAuthToken();


    const requestOptions = {
        ...options
    };


    requestOptions.headers = {
        ...(options.headers || {})
    };


    if (
        !requestOptions.headers["Content-Type"] &&
        requestOptions.body &&
        !(requestOptions.body instanceof FormData)
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


    return fetch(
        url,
        requestOptions
    );

}


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            alert(
                "Password recovery feature will be added later."
            );

        }
    );

}


// =====================================================
// ACCOUNT TYPE CHANGE
// =====================================================

const accountTypeSelect =
    document.getElementById(
        "accountType"
    );


const doctorSection =
    document.getElementById(
        "doctorSection"
    );


const studentSection =
    document.getElementById(
        "studentSection"
    );


const hospitalSection =
    document.getElementById(
        "hospitalSection"
    );


if (accountTypeSelect) {

    accountTypeSelect.addEventListener(
        "change",
        function () {

            const accountType =
                this.value
                    .trim()
                    .toUpperCase();


            // =============================================
            // SHOW / HIDE ACCOUNT SECTIONS
            // =============================================

            if (doctorSection) {

                doctorSection.style.display =
                    accountType === "DOCTOR"
                        ? "block"
                        : "none";

            }


            if (studentSection) {

                studentSection.style.display =
                    accountType === "STUDENT"
                        ? "block"
                        : "none";

            }


            if (hospitalSection) {

                hospitalSection.style.display =
                    accountType === "HOSPITAL"
                        ? "block"
                        : "none";

            }


            // =============================================
            // DOCTOR FIELDS
            // =============================================

            const doctorIdentityNumber =
                document.getElementById(
                    "doctorIdentityNumber"
                );


            const specialization =
                document.getElementById(
                    "specialization"
                );


            const qualification =
                document.getElementById(
                    "qualification"
                );


            const doctorType =
                document.getElementById(
                    "doctorType"
                );


            const doctorHospitalName =
                document.getElementById(
                    "doctorHospitalName"
                );


            const isDoctor =
                accountType === "DOCTOR";


            if (doctorIdentityNumber)
                doctorIdentityNumber.required =
                    isDoctor;


            if (specialization)
                specialization.required =
                    isDoctor;


            if (qualification)
                qualification.required =
                    isDoctor;


            if (doctorType)
                doctorType.required =
                    isDoctor;


            if (doctorHospitalName)
                doctorHospitalName.required =
                    isDoctor;


            // =============================================
            // STUDENT FIELDS
            // =============================================

            const studentCollegeName =
                document.getElementById(
                    "studentCollegeName"
                );


            const studentQualification =
                document.getElementById(
                    "studentQualification"
                );


            const studentYear =
                document.getElementById(
                    "studentYear"
                );


            const studentId =
                document.getElementById(
                    "studentId"
                );


            const isStudent =
                accountType === "STUDENT";


            if (studentCollegeName)
                studentCollegeName.required =
                    isStudent;


            if (studentQualification)
                studentQualification.required =
                    isStudent;


            if (studentYear)
                studentYear.required =
                    isStudent;


            if (studentId)
                studentId.required =
                    isStudent;


            // =============================================
            // HOSPITAL FIELDS
            // =============================================

            const hospitalName =
                document.getElementById(
                    "hospitalName"
                );


            const hospitalLocation =
                document.getElementById(
                    "hospitalLocation"
                );


            const hospitalType =
                document.getElementById(
                    "hospitalType"
                );


            const emergencyContact =
                document.getElementById(
                    "emergencyContact"
                );


            const hospitalAvailable =
                document.getElementById(
                    "hospitalAvailable"
                );


            const isHospital =
                accountType === "HOSPITAL";


            if (hospitalName)
                hospitalName.required =
                    isHospital;


            if (hospitalLocation)
                hospitalLocation.required =
                    isHospital;


            if (hospitalType)
                hospitalType.required =
                    isHospital;


            if (emergencyContact)
                emergencyContact.required =
                    isHospital;


            if (hospitalAvailable)
                hospitalAvailable.required =
                    isHospital;

        }
    );

}


// =====================================================
// REGISTER FORM
// =====================================================

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const accountTypeElement =
                document.getElementById(
                    "accountType"
                );


            const fullNameElement =
                document.getElementById(
                    "fullName"
                );


            const emailElement =
                document.getElementById(
                    "email"
                );


            const mobileElement =
                document.getElementById(
                    "mobile"
                );


            const usernameElement =
                document.getElementById(
                    "registerUsername"
                );


            const passwordElement =
                document.getElementById(
                    "registerPassword"
                );


            const confirmPasswordElement =
                document.getElementById(
                    "confirmPassword"
                );


            const termsElement =
                document.getElementById(
                    "terms"
                );


            const registerMessage =
                document.getElementById(
                    "registerMessage"
                );


            if (
                !accountTypeElement ||
                !fullNameElement ||
                !emailElement ||
                !mobileElement ||
                !usernameElement ||
                !passwordElement ||
                !confirmPasswordElement ||
                !termsElement
            ) {

                return;

            }


            const accountType =
                accountTypeElement.value
                    .trim()
                    .toUpperCase();


            const fullName =
                fullNameElement.value.trim();


            const email =
                emailElement.value.trim();


            const mobile =
                mobileElement.value.trim();


            const username =
                usernameElement.value.trim();


            const password =
                passwordElement.value;


            const confirmPassword =
                confirmPasswordElement.value;


            const terms =
                termsElement.checked;


            // =================================================
            // BASIC VALIDATION
            // =================================================

            if (
                accountType === "" ||
                fullName === "" ||
                email === "" ||
                mobile === "" ||
                username === "" ||
                password === "" ||
                confirmPassword === ""
            ) {

                if (registerMessage) {

                    registerMessage.textContent =
                        "Please fill all required fields.";

                    registerMessage.style.color =
                        "#dc2626";

                }

                return;

            }


            if (
                !/^[0-9]{10}$/.test(
                    mobile
                )
            ) {

                if (registerMessage) {

                    registerMessage.textContent =
                        "Please enter a valid 10-digit mobile number.";

                    registerMessage.style.color =
                        "#dc2626";

                }

                return;

            }


            if (
                password.length < 6
            ) {

                if (registerMessage) {

                    registerMessage.textContent =
                        "Password must be at least 6 characters.";

                    registerMessage.style.color =
                        "#dc2626";

                }

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                if (registerMessage) {

                    registerMessage.textContent =
                        "Passwords do not match.";

                    registerMessage.style.color =
                        "#dc2626";

                }

                return;

            }


            if (!terms) {

                if (registerMessage) {

                    registerMessage.textContent =
                        "Please accept the Terms and Privacy Policy.";

                    registerMessage.style.color =
                        "#dc2626";

                }

                return;

            }


            resetRegisterButton();


            // =================================================
            // HOSPITAL
            // =================================================

            if (
                accountType === "HOSPITAL"
            ) {

                const hospitalName =
                    document.getElementById(
                        "hospitalName"
                    )?.value.trim() || "";


                const hospitalLocation =
                    document.getElementById(
                        "hospitalLocation"
                    )?.value.trim() || "";


                const hospitalType =
                    document.getElementById(
                        "hospitalType"
                    )?.value
                    .trim()
                    .toUpperCase() || "";


                const emergencyContact =
                    document.getElementById(
                        "emergencyContact"
                    )?.value.trim() || "";


                const facilities =
                    document.getElementById(
                        "hospitalFacilities"
                    )?.value.trim() || "";


                const available =
                    document.getElementById(
                        "hospitalAvailable"
                    )?.value
                    .trim()
                    .toUpperCase() || "";


                if (
                    hospitalName === "" ||
                    hospitalLocation === "" ||
                    hospitalType === "" ||
                    emergencyContact === "" ||
                    available === ""
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Please fill all required hospital details.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                const hospitalData = {

                    name:
                        hospitalName,

                    location:
                        hospitalLocation,

                    type:
                        hospitalType,

                    emergencyContact:
                        emergencyContact,

                    facilities:
                        facilities,

                    available:
                        available,

                    username:
                        username,

                    password:
                        password

                };


                try {

                    const response =
                        await fetch(
                            `${HOSPITAL_API_URL}/register`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        hospitalData
                                    )

                            }
                        );


                    const data =
                        await readResponse(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(
                            getErrorMessage(
                                data,
                                "Hospital registration failed."
                            )
                        );

                    }


                    if (registerMessage) {

                        registerMessage.textContent =
                            "Hospital registration successful! You can now login.";

                        registerMessage.style.color =
                            "#16a34a";

                    }


                    setTimeout(
                        function () {

                            window.location.href =
                                "login.html";

                        },
                        1500
                    );

                }

                catch (error) {

                    console.error(
                        "Hospital Registration Error:",
                        error
                    );


                    if (registerMessage) {

                        registerMessage.textContent =
                            error.message;

                        registerMessage.style.color =
                            "#dc2626";

                    }


                    resetRegisterButton();

                }


                return;

            }


            // =================================================
            // DOCTOR
            // =================================================

            if (
                accountType === "DOCTOR"
            ) {

                const doctorIdentityNumber =
                    document.getElementById(
                        "doctorIdentityNumber"
                    )?.value.trim() || "";


                const specialization =
                    document.getElementById(
                        "specialization"
                    )?.value.trim() || "";


                const qualification =
                    document.getElementById(
                        "qualification"
                    )?.value.trim() || "";


                const experienceInput =
                    document.getElementById(
                        "experience"
                    )?.value.trim() || "";


                const doctorType =
                    document.getElementById(
                        "doctorType"
                    )?.value
                    .trim()
                    .toUpperCase() || "";


                const doctorHospitalName =
                    document.getElementById(
                        "doctorHospitalName"
                    )?.value.trim() || "";


                const hospitalAddress =
                    document.getElementById(
                        "hospitalAddress"
                    )?.value.trim() || "";


                const consultationFeeInput =
                    document.getElementById(
                        "consultationFee"
                    )?.value.trim() || "";


                // =================================================
                // DOCTOR IDENTITY VALIDATION
                // =================================================

                if (
                    doctorIdentityNumber === ""
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Doctor Identity Number is required.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                if (
                    doctorIdentityNumber.length < 5 ||
                    doctorIdentityNumber.length > 100
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Doctor Identity Number must be between 5 and 100 characters.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                if (
                    !/^[A-Za-z0-9\-\/]+$/.test(
                        doctorIdentityNumber
                    )
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Doctor Identity Number contains invalid characters.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                // =================================================
                // OTHER DOCTOR VALIDATION
                // =================================================

                if (
                    specialization === "" ||
                    qualification === "" ||
                    doctorType === "" ||
                    doctorHospitalName === ""
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Please fill all required doctor details.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                const experience =
                    experienceInput === ""
                        ? 0
                        : Number(
                            experienceInput
                        );


                const consultationFee =
                    consultationFeeInput === ""
                        ? 0
                        : Number(
                            consultationFeeInput
                        );


                if (
                    !Number.isFinite(
                        experience
                    ) ||
                    experience < 0
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Please enter a valid experience.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                if (
                    !Number.isFinite(
                        consultationFee
                    ) ||
                    consultationFee < 0
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Please enter a valid consultation fee.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                // =================================================
                // FINAL DOCTOR DATA
                // =================================================

                const doctorData = {

                    fullName:
                        fullName,

                    email:
                        email,

                    mobile:
                        mobile,

                    username:
                        username,

                    password:
                        password,

                    doctorIdentityNumber:
                        doctorIdentityNumber,

                    specialization:
                        specialization,

                    qualification:
                        qualification,

                    experience:
                        experience,

                    consultationFee:
                        consultationFee,

                    doctorType:
                        doctorType,

                    hospitalName:
                        doctorHospitalName,

                    hospitalAddress:
                        hospitalAddress

                };


                console.log(
                    "Doctor Registration Data:",
                    {
                        ...doctorData,
                        password: "[HIDDEN]"
                    }
                );


                try {

                    const response =
                        await fetch(
                            `${DOCTOR_API_URL}/register`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        doctorData
                                    )

                            }
                        );


                    const data =
                        await readResponse(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(
                            getErrorMessage(
                                data,
                                "Doctor registration failed."
                            )
                        );

                    }


                    if (registerMessage) {

                        registerMessage.textContent =
                            "Doctor registration successful! Your account is pending approval.";

                        registerMessage.style.color =
                            "#16a34a";

                    }


                    setTimeout(
                        function () {

                            window.location.href =
                                "login.html";

                        },
                        1500
                    );

                }

                catch (error) {

                    console.error(
                        "Doctor Registration Error:",
                        error
                    );


                    if (registerMessage) {

                        registerMessage.textContent =
                            error.message;

                        registerMessage.style.color =
                            "#dc2626";

                    }


                    resetRegisterButton();

                }


                return;

            }


            // =================================================
            // STUDENT
            // =================================================

            if (
                accountType === "STUDENT"
            ) {

                const collegeName =
                    document.getElementById(
                        "studentCollegeName"
                    )?.value.trim() || "";


                const studentQualification =
                    document.getElementById(
                        "studentQualification"
                    )?.value.trim() || "";


                const yearValue =
                    document.getElementById(
                        "studentYear"
                    )?.value.trim() || "";


                const studentId =
                    document.getElementById(
                        "studentId"
                    )?.value.trim() || "";


                const year =
                    Number(
                        yearValue
                    );


                if (
                    collegeName === "" ||
                    studentQualification === "" ||
                    yearValue === "" ||
                    studentId === ""
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Please fill all required student details.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                if (
                    !Number.isInteger(year) ||
                    year < 1 ||
                    year > 5
                ) {

                    if (registerMessage) {

                        registerMessage.textContent =
                            "Please select a valid medical college year.";

                        registerMessage.style.color =
                            "#dc2626";

                    }

                    resetRegisterButton();

                    return;

                }


                const studentData = {

                    fullName:
                        fullName,

                    email:
                        email,

                    mobile:
                        mobile,

                    username:
                        username,

                    password:
                        password,

                    collegeName:
                        collegeName,

                    qualification:
                        studentQualification,

                    year:
                        year,

                    studentId:
                        studentId,

                    available:
                        true

                };


                try {

                    const response =
                        await fetch(
                            `${STUDENT_API_URL}/register`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        studentData
                                    )

                            }
                        );


                    const data =
                        await readResponse(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(
                            getErrorMessage(
                                data,
                                "Student registration failed."
                            )
                        );

                    }


                    if (registerMessage) {

                        registerMessage.textContent =
                            "Medical student registration successful! You can now login.";

                        registerMessage.style.color =
                            "#16a34a";

                    }


                    setTimeout(
                        function () {

                            window.location.href =
                                "login.html";

                        },
                        1500
                    );

                }

                catch (error) {

                    console.error(
                        "Student Registration Error:",
                        error
                    );


                    if (registerMessage) {

                        registerMessage.textContent =
                            error.message;

                        registerMessage.style.color =
                            "#dc2626";

                    }


                    resetRegisterButton();

                }


                return;

            }


            // =================================================
            // NORMAL USER
            // =================================================

            if (
                accountType === "USER"
            ) {

                const userData = {

                    fullName:
                        fullName,

                    email:
                        email,

                    mobile:
                        mobile,

                    username:
                        username,

                    password:
                        password

                };


                try {

                    const response =
                        await fetch(
                            `${USER_API_URL}/register`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        userData
                                    )

                            }
                        );


                    const data =
                        await readResponse(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(
                            getErrorMessage(
                                data,
                                "Registration failed."
                            )
                        );

                    }


                    if (registerMessage) {

                        registerMessage.textContent =
                            "Account created successfully!";

                        registerMessage.style.color =
                            "#16a34a";

                    }


                    setTimeout(
                        function () {

                            window.location.href =
                                "login.html";

                        },
                        1200
                    );

                }

                catch (error) {

                    console.error(
                        "User Registration Error:",
                        error
                    );


                    if (registerMessage) {

                        registerMessage.textContent =
                            error.message;

                        registerMessage.style.color =
                            "#dc2626";

                    }


                    resetRegisterButton();

                }

            }

        }
    );

}


// =====================================================
// RESET REGISTER BUTTON
// =====================================================

function resetRegisterButton() {

    const registerButton =
        document.getElementById(
            "registerButton"
        );


    if (registerButton) {

        registerButton.disabled =
            false;

        registerButton.textContent =
            "Create Account";

    }

}


// =====================================================
// CLEAR LOGIN STORAGE
// =====================================================

function clearLoginStorage() {

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
        "isLoggedIn"
    );

    localStorage.removeItem(
        "userRole"
    );

    localStorage.removeItem(
        AUTH_TOKEN_KEY
    );

    localStorage.removeItem(
        "token"
    );

}


// =====================================================
// ERROR MESSAGE
// =====================================================

function getErrorMessage(
    data,
    defaultMessage
) {

    if (
        typeof data === "string" &&
        data.trim() !== ""
    ) {

        return data;

    }


    if (
        data &&
        data.message
    ) {

        return data.message;

    }


    return defaultMessage;

}


// =====================================================
// SAFE RESPONSE READER
// =====================================================

async function readResponse(
    response
) {

    const contentType =
        response.headers.get(
            "content-type"
        );


    if (
        contentType &&
        contentType.includes(
            "application/json"
        )
    ) {

        return await response.json();

    }


    return await response.text();

}


// =====================================================
// GLOBAL EXPORTS
// =====================================================

window.getAuthToken =
    getAuthToken;


window.authenticatedFetch =
    authenticatedFetch;


window.clearLoginStorage =
    clearLoginStorage;


window.saveAuthentication =
    saveAuthentication;


console.log(
    "HealthConnect Authentication Ready"
);