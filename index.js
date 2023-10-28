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
            salary: document.getElementById("salary").value, // Added this line
            qualification: document.getElementById("qualification").value, // Added this line
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

const stripMarkdown = markdownText => {
    const strippedText = markdownText
        .replace(/#+\s?/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/`{3}[\s\S]*?`{3}/g, '')
        .replace(/---/g, '');
    return strippedText;
};
// Function to set up event listeners for Markdown stripping
function setUpMarkdownStripping(textarea) {
    textarea.addEventListener('input', function() {
        var noMarkdown = stripMarkdown(textarea.value);
        textarea.value = noMarkdown;
    });
}

function loadJobPosts() {
    const jobPostsDiv = document.getElementById("jobPosts");
    const jobPosts = getJobPosts();
    
    jobPostsDiv.innerHTML = "";

    jobPosts.forEach((job, index) => {
        const jobDiv = document.createElement("div");
        jobDiv.classList.add("job-posting");

        let showPOCButton = '';
        if (job.poc) {
            showPOCButton = '<button class="show-poc">Show POC</button>';
        }

        jobDiv.innerHTML = `
    <div class="job-details">
        <h2>${job.title} at ${job.company}</h2>
        <p>Location: ${job.location}</p>
        <p>Job Description: ${job.description}</p>
        <p>Skills Required: ${job.skills}</p>
        <p>Salary: ${job.salary}</p> 
        <p>Qualification: ${job.qualification}</p> 
        <p>Date Posted: ${job.date}</p>
        <p><a href="${job.link}" target="_blank">Link to Job</a></p>
        <button onclick="editJobPost(${index})">Edit</button>
        <button onclick="deleteJobPost(${index})">Delete</button>
        ${showPOCButton}
        <button class="add-poc">Add POC</button>
<button class="apply" data-index="${index}">Apply</button>
        <div class="poc-details" hidden>
            <strong>Name:</strong> ${job.poc ? job.poc.name : 'N/A'}<br>
            <strong>Email:</strong> ${job.poc ? job.poc.email : 'N/A'}<br>
            <strong>Phone:</strong> ${job.poc ? job.poc.phone : 'N/A'}
        </div>
    </div>
    <div class="resume-section">
        <strong>Custom Resume:</strong>
        <textarea class="custom-resume" placeholder="Paste custom resume here...">${job.customResume || ""}</textarea>
        <button class="save-changes" onclick="saveResume(${index}, this)">Save Resume</button>
        <button class="download-res-txt" onclick="downloadText(this, '${job.title}', '${job.company}')">Download Resume as TXT</button>
        <button class="download-res-pdf" onclick="downloadPDF(this, '${job.title}', '${job.company}')">Download Resume as PDF</button>
    </div>
    <div class="coverletter-section">
        <strong>Cover Letter:</strong>
        <textarea class="custom-coverletter" placeholder="Paste cover letter here...">${job.customCoverLetter || ""}</textarea>
        <button class="save-changes" onclick="saveCoverLetter(${index}, this)">Save Cover Letter</button>
        <button class="download-res-txt" onclick="downloadText(this, '${job.title}', '${job.company}')">Download Resume as TXT</button>
        <button class="download-res-pdf" onclick="downloadPDF(this, '${job.title}', '${job.company}')">Download Resume as PDF</button>
    </div>
`;


        jobPostsDiv.appendChild(jobDiv);

        if (job.poc) {
            jobDiv.querySelector(".show-poc").addEventListener("click", function() {
                const pocDetails = jobDiv.querySelector(".poc-details");
                pocDetails.hidden = !pocDetails.hidden;
            });
        }

        const applyButton = jobDiv.querySelector(".apply");
        if (job.applyBtn && job.applyBtn.includes('applyingToThis')) {
            applyButton.classList.add('applyingToThis');
        }
        if (job.applyBtn && job.applyBtn.includes('applied')) {
            applyButton.classList.add('applied');
        }

        jobDiv.querySelector(".apply").addEventListener("click", function () {
            applyToThisJob(index, this);
        }, { once: true });

        jobDiv.querySelector(".add-poc").addEventListener("click", function() {
            modal.style.display = "block";
            currentJobIndex = index;
        });
    });
}

const downloadText = (btnElement, jobTitle, jobCompany) => {
    const customresumeTextarea = btnElement.parentElement.querySelector('.custom-resume');
    const coverLetterTextarea = btnElement.parentElement.querySelector('.custom-coverletter');
    let type;
    let text;
    if (customresumeTextarea) {
        type = 'Resume';
        console.log('type', type);
        text = customresumeTextarea.value
    } else if (coverLetterTextarea) {
        type = 'CoverLetter';
        console.log('type', type);
        text = coverLetterTextarea.value;
    } else {
        console.log('ERROR: prevTextArea', customresumeTextarea || coverLetterTextarea, 'Type:', typeof(customresumeTextarea || coverLetterTextarea))// Unexpected type, exit function
        return;
    }
    
    const strippedText = stripMarkdown(text);
    const blob = new Blob([strippedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobTitle}_${jobCompany}_Custom${type}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};


function downloadPDF(btnElement, jobTitle, jobCompany) {
    const customresumeTextarea = btnElement.parentElement.querySelector('.custom-resume');
    const coverLetterTextarea = btnElement.parentElement.querySelector('.custom-coverletter');
    let type;
    let text;
    if (customresumeTextarea) {
        type = 'Resume';
        console.log('type', type);
    } else if (coverLetterTextarea) {
        type = 'CoverLetter';
        console.log('type', type);
    } else {
        console.log('ERROR: prevTextArea', customresumeTextarea || coverLetterTextarea, 'Type:', typeof(customresumeTextarea || coverLetterTextarea))// Unexpected type, exit function
        return;
    }

    const textArea = customresumeTextarea ? customresumeTextarea : coverLetterTextarea;

    html2pdf(textArea, {
        margin: [0, 0],  
        filename: `${jobTitle}_${jobCompany}_Custom${type}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 5, x: 500, y: 400, 
            width: 1000, height: 1300, 
            logging: true, dpi: 600, 
            letterRendering: true 
        },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    });
}




function saveResume(index, btnElement) {
    const jobPosts = getJobPosts();
    const textarea = btnElement.parentElement.querySelector('textarea');
    jobPosts[index].customResume = textarea.value;
    setJobPosts(jobPosts);
}

function saveCoverLetter(index, btnElement) {
    const jobPosts = getJobPosts();
    const textarea = btnElement.parentElement.querySelector('textarea');
    jobPosts[index].customCoverLetter = textarea.value;
    setJobPosts(jobPosts);
}

function applyToThisJob(index, btnElement) {
    const jobPosts = getJobPosts();
    // Example: Send this job data to a server or perform other operations
    // sendJobApplicationToServer(applyToJob);
    
    btnElement.classList.add('applyingToThis');
    jobPosts[index].applyBtn = btnElement.classList.value;
    setJobPosts(jobPosts);
}

function appliedToJob(index, btnElement) {
    const jobPosts = getJobPosts();
    // Example: Send this job data to a server or perform other operations
    // sendJobApplicationToServer(applyToJob);
    btnElement.classList.add('applied');
    btnElement.classList.remove('applyingToThis');
    jobPosts[index].applyBtn = btnElement.classList.value;
    setJobPosts(jobPosts);
}


function editJobPost(index) {
    const jobPosts = getJobPosts();
    const job = jobPosts[index];

    document.getElementById("title").value = job.title;
    document.getElementById("company").value = job.company;
    document.getElementById("location").value = job.location;
    document.getElementById("description").value = job.description;
    document.getElementById("skills").value = job.skills;
    document.getElementById("salary").value = job.salary; // Added this line
    document.getElementById("qualification").value = job.qualification; // Added this line
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


// const textInput = document.querySelector('input#text-input-what');
// const postText = 'Im_______INTHERE';

// // function insertAfterEquals(str, textToInsert) {
// //     const index = str.indexOf('=');
// //     if (index === -1) {
// //         return str;  // '=' not found in the string
// //     }
// //     return str.slice(0, index + 1) + textToInsert + str.slice(index + 1);
// // } 


// function setText (input, text) {
// input.focus();
// // const getForm = document.querySelector('form#jobsearch');
// // const getAction = getForm.getAttribute('action');
// // console.log(getAction);
// console.log(text);
// // const setAction = insertAfterEquals(getAction, text);
// // console.log(setAction); 
// // humanType(input, text, function() {
// //     console.log('Finished typing!');
// // });
// humanType(input, text, function() {
//     console.log('Finished typing!');
// });
// input.setAttribute('value', text);
// //input.value = text;
// //getForm.setAttribute('action', setAction);
// }
// //console.log(setText(textInput, postText));

// setText(textInput, postText);

// function humanType(element, str, callback) {
//     let index = 0;

//     function typeNextChar() {
//         if (index < str.length) {
//             element.value += str[index++];
//             setTimeout(typeNextChar, getRandomDelay());  // Call itself to type the next character after a delay
//         } else if (callback) {
//             callback();
//         }
//     }

//     function getRandomDelay() {
//         // Get a random delay between 100 and 200 milliseconds
//         return Math.random() * 100 + 100;
//     }

//     typeNextChar();  // Start typing
//}