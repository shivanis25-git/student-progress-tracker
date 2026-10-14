

let editingId = null;




const progressForm =
    document.getElementById("progressForm");

const submitButton =
    document.getElementById("submitButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const statusMessage =
    document.getElementById("statusMessage");




function getProgressStatus(percentage) {

    if (percentage <= 30) {
        return "Beginner";
    }

    if (percentage <= 70) {
        return "In Progress";
    }

    return "Almost Done";
}




function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}




progressForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const studentName =
        document.getElementById("studentName").value;

    const courseName =
        document.getElementById("courseName").value;

    const completionPercentage =
        document.getElementById("completionPercentage").value;


    try {

    

        if (editingId !== null) {

            const response = await fetch(
                `http://localhost:3000/progress/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        studentName: studentName,
                        courseName: courseName,
                        completionPercentage:
                            Number(completionPercentage)
                    })
                }
            );


            const data =
                await response.json();


            console.log(data);


            if (data.success) {

                statusMessage.textContent =
                    "Progress updated successfully!";

                progressForm.reset();

                editingId = null;

                submitButton.textContent =
                    "Add Progress";

                cancelEditButton.style.display =
                    "none";

                loadProgress();
            }

            return;
        }



        const response = await fetch(
            "http://localhost:3000/progress",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    studentName: studentName,
                    courseName: courseName,
                    completionPercentage:
                        Number(completionPercentage)
                })
            }
        );


        const data =
            await response.json();


        console.log(data);


        if (data.success) {

            statusMessage.textContent =
                "Progress added successfully!";

            progressForm.reset();

            loadProgress();
        }

    } catch (error) {

        console.error("Error:", error);

        statusMessage.textContent =
            "Something went wrong!";
    }
});




async function loadProgress() {

    try {

        const response = await fetch(
            "http://localhost:3000/progress"
        );


        const data =
            await response.json();


        console.log(data);


        const progressList =
            document.getElementById("progressList");


        progressList.innerHTML = "";


        data.progress.forEach((item) => {

            const card =
                document.createElement("div");


            card.innerHTML = `
                <h3>${item.studentName}</h3>

                <p>
                    Course:
                    ${item.courseName}
                </p>

                <p>
                    Completion:
                    ${item.completionPercentage}%
                </p>

                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width: ${item.completionPercentage}%"
                    ></div>
                </div>

                <p class="progress-status">
                    Status:
                    ${getProgressStatus(
                        item.completionPercentage
                    )}
                </p>

                <p>
                    Last Updated:
                    ${formatDate(item.lastUpdated)}
                </p>

                <button
                    onclick="editProgress('${item._id}')"
                >
                    Edit
                </button>

                <button
                    onclick="deleteProgress('${item._id}')"
                >
                    Delete
                </button>

                <hr>
            `;


            progressList.appendChild(card);
        });

    } catch (error) {

        console.error(
            "Error loading progress:",
            error
        );

        statusMessage.textContent =
            "Failed to load progress.";
    }
}




async function editProgress(id) {

    try {

        const response = await fetch(
            "http://localhost:3000/progress"
        );


        const data =
            await response.json();


        const progress =
            data.progress.find(
                (item) => item._id === id
            );


        if (!progress) {

            statusMessage.textContent =
                "Progress not found!";

            return;
        }


        // Store ID
        editingId = id;


        // Put existing data into form
        document.getElementById(
            "studentName"
        ).value =
            progress.studentName;


        document.getElementById(
            "courseName"
        ).value =
            progress.courseName;


        document.getElementById(
            "completionPercentage"
        ).value =
            progress.completionPercentage;


        // Change button
        submitButton.textContent =
            "Update Progress";


        // Show cancel button
        cancelEditButton.style.display =
            "inline-block";


        statusMessage.textContent =
            "Editing progress...";

    } catch (error) {

        console.error(
            "Error loading progress:",
            error
        );

        statusMessage.textContent =
            "Something went wrong!";
    }
}


// CANCEL EDIT

function cancelEdit() {

    editingId = null;

    progressForm.reset();

    submitButton.textContent =
        "Add Progress";

    cancelEditButton.style.display =
        "none";

    statusMessage.textContent =
        "Edit cancelled.";
}


cancelEditButton.addEventListener(
    "click",
    cancelEdit
);



// DELETE

async function deleteProgress(id) {

    try {

        const response = await fetch(
            `http://localhost:3000/progress/${id}`,
            {
                method: "DELETE"
            }
        );


        const data =
            await response.json();


        console.log(data);


        if (data.success) {

            statusMessage.textContent =
                "Progress deleted successfully!";

            loadProgress();
        }

    } catch (error) {

        console.error(
            "Error deleting progress:",
            error
        );

        statusMessage.textContent =
            "Something went wrong!";
    }
}


// Load data when page opens
//

loadProgress();