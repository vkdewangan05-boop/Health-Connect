// =====================================================
// HEALTHCONNECT
// MEDICAL STUDENT REGISTRATION
// =====================================================

const STUDENT_API =
    "http://localhost:8080/api/students";



const form =
    document.getElementById(
        "studentRegisterForm"
    );



if (form) {

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "studentRegisterMessage"
                );


            const fullName =
                document.getElementById(
                    "fullName"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const mobile =
                document.getElementById(
                    "mobile"
                ).value.trim();


            const username =
                document.getElementById(
                    "username"
                ).value.trim();


            const password =
                document.getElementById(
                    "password"
                ).value.trim();


            const collegeName =
                document.getElementById(
                    "collegeName"
                ).value.trim();


            const qualification =
                document.getElementById(
                    "qualification"
                ).value.trim();


            const year =
                Number(
                    document.getElementById(
                        "year"
                    ).value
                );


            const studentId =
                document.getElementById(
                    "studentId"
                ).value.trim();



            if (
                !fullName ||
                !email ||
                !mobile ||
                !username ||
                !password ||
                !collegeName ||
                !qualification ||
                !studentId
            ) {

                message.textContent =
                    "Please fill all required fields.";

                message.style.color =
                    "red";

                return;

            }



            if (
                !/^[0-9]{10}$/.test(mobile)
            ) {

                message.textContent =
                    "Please enter a valid 10-digit mobile number.";

                message.style.color =
                    "red";

                return;

            }



            if (password.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                message.style.color =
                    "red";

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
                    qualification,

                year:
                    year,

                studentId:
                    studentId,

                available:
                    true

            };



            try {

                message.textContent =
                    "Registering student...";

                message.style.color =
                    "#2563eb";



                const response =
                    await fetch(
                        STUDENT_API +
                        "/register",
                        {

                            method:
                                "POST",

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



                const contentType =
                    response.headers.get(
                        "content-type"
                    );


                let data;


                if (
                    contentType &&
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    data =
                        await response.json();

                }

                else {

                    data =
                        await response.text();

                }



                if (!response.ok) {

                    const errorMessage =
                        typeof data === "string"
                            ? data
                            : (
                                data.message ||
                                "Student registration failed."
                            );


                    throw new Error(
                        errorMessage
                    );

                }



                message.textContent =
                    "Student registration successful!";

                message.style.color =
                    "green";



                setTimeout(
                    function() {

                        window.location.href =
                            "../login.html";

                    },
                    1200
                );

            }

            catch(error) {

                console.error(error);

                message.textContent =
                    error.message ||
                    "Unable to register student.";

                message.style.color =
                    "red";

            }

        }
    );

}