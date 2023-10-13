let currentJobIndex = null;

document.addEventListener("DOMContentLoaded", function() {
    loadJobPosts();

    document.getElementById("jobForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        const editIndex = document.getElementById("editIndex").value;
        const jobData = {
            title: document.getElementById("title").value,
            company: document.getElementById("company").value,
            location: document.getElementById("location").value,
            description: document.getElementById("description").value,
            skills: document.getElementById("skills").value,
            date: document.getElementById("date").value,
            link: document.getElementById("link").value,
            poc: {
                name: document.getElementById("contactName").value,
                email: document.getElementById("contactEmail").value,
                phone: document.getElementById("contactPhone").value
            }
        };
        
        if (editIndex === "") {
            addJobPost(jobData);
        } else {
            updateJobPost(editIndex, jobData);
            document.getElementById("editIndex").value = "";
        }
        
        this.reset();
        loadJobPosts();
    });

    document.getElementById("contactForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const contact = {
            name: document.getElementById("contactName").value,
            email: document.getElementById("contactEmail").value,
            phone: document.getElementById("contactPhone").value
        };

        if (currentJobIndex !== null) {
            const jobPosts = getJobPosts();
            if (!jobPosts[currentJobIndex].poc) {
                jobPosts[currentJobIndex].poc = {};
            }
            jobPosts[currentJobIndex].poc = contact;
            setJobPosts(jobPosts);
            loadJobPosts();
        }

        modal.style.display = "none"; 
        document.getElementById("contactForm").reset(); 
    });
});

function getJobPosts() {
    const jobPosts = localStorage.getItem("jobPosts");
    return jobPosts ? JSON.parse(jobPosts) : [];
}

function setJobPosts(jobPosts) {
    localStorage.setItem("jobPosts", JSON.stringify(jobPosts));
}

function addJobPost(jobData) {
    const jobPosts = getJobPosts();
    jobPosts.push(jobData);
    setJobPosts(jobPosts);
}

function updateJobPost(index, jobData) {
    const jobPosts = getJobPosts();
    jobPosts[index] = jobData;
    setJobPosts(jobPosts);
}

function deleteJobPost(index) {
    const jobPosts = getJobPosts();
    jobPosts.splice(index, 1);
    setJobPosts(jobPosts);
    loadJobPosts();
}

function loadJobPosts() {
    const jobPostsDiv = document.getElementById("jobPosts");
    const jobPosts = getJobPosts();

    jobPostsDiv.innerHTML = "";

    jobPosts.forEach((job, index) => {
        const jobDiv = document.createElement("div");
        jobDiv.classList.add("job-posting");

        jobDiv.innerHTML = `
            <h2>${job.title} at ${job.company}</h2>
            <p>Location: ${job.location}</p>
            <p>Job Description: ${job.description}</p>
            <p>Skills Required: ${job.skills}</p>
            <p>Date Posted: ${job.date}</p>
            <p><a href="${job.link}" target="_blank">Link to Job</a></p>
            <button onclick="editJobPost(${index})">Edit</button>
            <button onclick="deleteJobPost(${index})">Delete</button>
            <button class="show-poc">Show POC</button>
            <div class="poc-details" hidden>
                <strong>Name:</strong> ${job.poc ? job.poc.name : 'N/A'}<br>
                <strong>Email:</strong> ${job.poc ? job.poc.email : 'N/A'}<br>
                <strong>Phone:</strong> ${job.poc ? job.poc.phone : 'N/A'}
            </div>
        `;

        jobPostsDiv.appendChild(jobDiv);

        const addPocButton = document.createElement("button");
        addPocButton.textContent = "Add POC";
        addPocButton.addEventListener("click", function() {
            modal.style.display = "block";
            currentJobIndex = index;
        });
        jobDiv.appendChild(addPocButton);

        jobDiv.querySelector(".show-poc").addEventListener("click", function() {
            const pocDetails = this.nextElementSibling;
            pocDetails.hidden = !pocDetails.hidden;
        });
    });
}

function editJobPost(index) {
    const jobPosts = getJobPosts();
    const job = jobPosts[index];

    document.getElementById("title").value = job.title;
    document.getElementById("company").value = job.company;
    document.getElementById("location").value = job.location;
    document.getElementById("description").value = job.description;
    document.getElementById("skills").value = job.skills;
    document.getElementById("date").value = job.date;
    document.getElementById("link").value = job.link;
    document.getElementById("editIndex").value = index;
}

const modal = document.getElementById("contactModal");
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



