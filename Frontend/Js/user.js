// =====================================================
// HEALTHCONNECT
// USER AUTHENTICATION & DASHBOARD JAVASCRIPT
// =====================================================

console.log("User module loaded successfully.");


// =====================================================
// JWT TOKEN KEY
// =====================================================

const AUTH_TOKEN_KEY = "authToken";


// =====================================================
// GET JWT TOKEN
// =====================================================

function getUserAuthToken() {

    let token =
        localStorage.getItem(AUTH_TOKEN_KEY);

    if (
        token &&
        token.trim() !== ""
    ) {

        return token.trim();

    }

    token =
        localStorage.getItem("token");

    if (
        token &&
        token.trim() !== ""
    ) {

        return token.trim();

    }

    return null;
}


// =====================================================
// CLEAR AUTHENTICATION DATA
// =====================================================

function clearUserAuthenticationData() {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    localStorage.removeItem("authToken");
    localStorage.removeItem("token");

    localStorage.removeItem("doctor");
    localStorage.removeItem("loggedInDoctor");

    localStorage.removeItem("hospital");
    localStorage.removeItem("loggedInHospital");

    localStorage.removeItem("loggedInStudent");
}


// =====================================================
// CHECK LOGIN
// =====================================================

function checkLogin() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    const storedUser =
        localStorage.getItem("loggedInUser");

    const token =
        getUserAuthToken();


    // ==========================================
    // USER NOT LOGGED IN
    // ==========================================

    if (
        isLoggedIn !== "true" ||
        !storedUser ||
        !token
    ) {

        alert(
            "Your login session is invalid. Please login again."
        );

        clearUserAuthenticationData();

        window.location.href =
            "../login.html";

        return false;
    }


    // ==========================================
    // VERIFY USER JSON
    // ==========================================

    try {

        const user =
            JSON.parse(storedUser);

        if (
            !user ||
            typeof user !== "object"
        ) {

            throw new Error(
                "Invalid user data."
            );

        }

        return true;

    }

    catch (error) {

        console.error(
            "Invalid logged-in user data:",
            error
        );

        clearUserAuthenticationData();

        alert(
            "Your login session is invalid. Please login again."
        );

        window.location.href =
            "../login.html";

        return false;
    }
}


// =====================================================
// GET LOGGED-IN USER
// =====================================================

function getLoggedInUser() {

    const storedUser =
        localStorage.getItem(
            "loggedInUser"
        );

    if (!storedUser) {

        return null;

    }

    try {

        const user =
            JSON.parse(
                storedUser
            );

        if (
            !user ||
            typeof user !== "object"
        ) {

            return null;

        }

        return user;

    }

    catch (error) {

        console.error(
            "Error reading logged-in user:",
            error
        );

        return null;

    }

}


// =====================================================
// AUTHENTICATED FETCH
// =====================================================
// Protected backend APIs should use this function.
//
// Automatically sends:
//
// Authorization: Bearer <JWT TOKEN>
//
// =====================================================

async function userAuthenticatedFetch(
    url,
    options = {}
) {

    const token =
        getUserAuthToken();


    // ==========================================
    // TOKEN MISSING
    // ==========================================

    if (!token) {

        console.error(
            "JWT token is missing."
        );

        throw new Error(
            "AUTH_TOKEN_MISSING"
        );

    }


    const requestOptions = {
        ...options
    };


    // ==========================================
    // COPY EXISTING HEADERS
    // ==========================================

    requestOptions.headers = {
        ...(options.headers || {})
    };


    // ==========================================
    // CONTENT TYPE
    // ==========================================

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


    // ==========================================
    // JWT AUTHORIZATION HEADER
    // ==========================================

    requestOptions.headers[
        "Authorization"
    ] =
        "Bearer " + token;


    console.log(
        "Authenticated API Request:",
        url
    );


    return fetch(
        url,
        requestOptions
    );

}


// =====================================================
// HANDLE API RESPONSE
// =====================================================

async function handleUserApiResponse(
    response
) {

    // ==========================================
    // 401 UNAUTHORIZED
    // ==========================================

    if (
        response.status === 401
    ) {

        console.error(
            "API returned 401 Unauthorized."
        );

        alert(
            "Your login session has expired or is invalid. Please login again."
        );

        clearUserAuthenticationData();

        window.location.href =
            "../login.html";

        return null;
    }


    // ==========================================
    // 403 FORBIDDEN
    // ==========================================

    if (
        response.status === 403
    ) {

        console.error(
            "API returned 403 Forbidden."
        );

        throw new Error(
            "FORBIDDEN"
        );

    }


    return response;

}


// =====================================================
// LOGOUT
// =====================================================

function logoutUser() {

    console.log(
        "Logging out user..."
    );


    clearUserAuthenticationData();


    // ==========================================
    // REDIRECT TO LOGIN
    // ==========================================

    window.location.href =
        "../login.html";

}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "User dashboard DOM loaded."
        );


        // ==========================================
        // CHECK LOGIN
        // ==========================================

        if (!checkLogin()) {

            return;

        }


        // ==========================================
        // GET CURRENT USER
        // ==========================================

        const user =
            getLoggedInUser();


        if (!user) {

            alert(
                "Unable to read your login information."
            );

            logoutUser();

            return;

        }


        // ==========================================
        // DISPLAY USER NAME
        // ==========================================

        const welcome =
            document.getElementById(
                "userWelcome"
            );


        if (
            welcome &&
            user
        ) {

            const name =
                user.fullName ||
                user.name ||
                user.username ||
                "User";


            welcome.textContent =
                "Welcome, " +
                name +
                "!";

        }


        // ==========================================
        // DEBUG INFORMATION
        // ==========================================

        console.log(
            "=========================================="
        );

        console.log(
            "HealthConnect User Dashboard"
        );

        console.log(
            "Logged-in User:",
            user
        );

        console.log(
            "User ID:",
            user.id ??
            user.userId ??
            "Not available"
        );

        console.log(
            "Username:",
            user.username ??
            "Not available"
        );

        console.log(
            "Role:",
            user.role ??
            localStorage.getItem("userRole") ??
            "USER"
        );

        console.log(
            "JWT Token Available:",
            getUserAuthToken()
                ? "YES"
                : "NO"
        );

        console.log(
            "=========================================="
        );

    }
);


// =====================================================
// GLOBAL EXPORTS
// =====================================================

window.getUserAuthToken =
    getUserAuthToken;

window.userAuthenticatedFetch =
    userAuthenticatedFetch;

window.handleUserApiResponse =
    handleUserApiResponse;

window.checkLogin =
    checkLogin;

window.getLoggedInUser =
    getLoggedInUser;

window.logoutUser =
    logoutUser;

window.clearUserAuthenticationData =
    clearUserAuthenticationData;