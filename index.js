document.getElementById('jobForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        location: document.getElementById('location').value,
        skills: document.getElementById('skills').value,
        date: document.getElementById('date').value,
        link: document.getElementById('link').value
    };

    // Store data in local storage
    let jobPosts = JSON.parse(localStorage.getItem('jobPosts') || "[]");
    jobPosts.push(formData);
    localStorage.setItem('jobPosts', JSON.stringify(jobPosts));

    displayJobPosts();  // Function to display jobs from local storage
});

function displayJobPosts() {
    const jobPosts = JSON.parse(localStorage.getItem('jobPosts') || "[]");
    const jobContainer = document.getElementById('jobPosts');
    jobContainer.innerHTML = '';  // Clear out old posts

    jobPosts.forEach(job => {
        let jobElem = document.createElement('div');
        jobElem.innerHTML = `
            <h3>${job.title} at ${job.company}</h3>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Skills Required:</strong> ${job.skills}</p>
            <p><strong>Date Posted:</strong> ${job.date}</p>
            <p><a href="${job.link}" target="_blank">Link to Job Posting</a></p>
            <hr>
        `;
        jobContainer.appendChild(jobElem);
    });
}

// Load and display jobs when page loads
window.onload = displayJobPosts;
