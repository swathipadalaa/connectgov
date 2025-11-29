document.addEventListener('DOMContentLoaded', () => {
    // --- SIMULATED DATA STORE ---
    let issues = [{
        id: 1,
        title: "Pothole near Central Park",
        description: "Large pothole making driving unsafe.",
        citizenId: 101,
        politicianId: 201,
        status: "Reported",
        response: null
    }];

    let updates = [];

    let users = [{
        id: 101,
        name: "John Citizen",
        role: "citizen"
    }, {
        id: 201,
        name: "Councilor Jane Doe",
        role: "politician"
    }, {
        id: 301,
        name: "Admin Smith",
        role: "admin"
    }, {
        id: 401,
        name: "Moderator Lee",
        role: "moderator"
    }];

    const appRoot = document.getElementById('app-root');
    const roleSelector = document.getElementById('userRole');

    // --- RENDER VIEWS ---

    const renderCitizenView = () => {
        // Simulated login for citizen with id 101
        const myIssues = issues.filter(i => i.citizenId === 101);
        appRoot.innerHTML = `
            <div class="card">
                <h2>📢 Report an Issue</h2>
                <form id="report-form">
                    <input type="text" id="issue-title" placeholder="Title" required />
                    <textarea id="issue-desc" placeholder="Describe the issue..." required></textarea>
                    <button class="btn">Submit</button>
                </form>
            </div>

            <h2>My Issues</h2>
            ${myIssues.length === 0 ? '<p>You have not reported any issues yet.</p>' : ''}
            ${myIssues.map(issue => `
                <div class="card">
                    <h3>${issue.title}</h3>
                    <p>${issue.description}</p>
                    ${issue.response ? `<p><strong>Response:</strong> ${issue.response}</p>` : ''}
                    <div class="status status-${issue.status.toLowerCase().replace(' ', '')}">${issue.status}</div>
                </div>
            `).join('')}

            <h2>Official Updates</h2>
            ${updates.length === 0 ? '<p>No official updates at this time.</p>' : ''}
            ${updates.map(u => `
                <div class="card">
                    <p>${u.content}</p>
                    <small>– ${u.politicianName}</small>
                </div>
            `).join('')}
        `;
    };

    const renderPoliticianView = () => {
        // Simulated login for politician with id 201
        const myIssues = issues.filter(i => i.politicianId === 201);
        appRoot.innerHTML = `
            <div class="card">
                <h2>🗣 Post an Update</h2>
                <form id="update-form">
                    <textarea id="update-content" placeholder="Your update..." required></textarea>
                    <button class="btn">Post</button>
                </form>
            </div>

            <h2>Constituent Issues</h2>
            ${myIssues.length === 0 ? '<p>No issues assigned to you.</p>' : ''}
            ${myIssues.map(issue => `
                <div class="card" data-id="${issue.id}">
                    <h3>${issue.title}</h3>
                    <p>${issue.description}</p>
                    <textarea class="response" placeholder="Type your response...">${issue.response || ''}</textarea>
                    <select class="status-selector">
                        <option value="Reported" ${issue.status === "Reported" ? 'selected' : ''}>Reported</option>
                        <option value="In Progress" ${issue.status === "In Progress" ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${issue.status === "Resolved" ? 'selected' : ''}>Resolved</option>
                    </select>
                    <button class="btn save-response">Save</button>
                </div>
            `).join('')}
        `;
    };

    const renderModeratorView = () => {
        appRoot.innerHTML = `
            <h2>Moderation Queue</h2>
            ${issues.length === 0 ? '<p>The queue is empty.</p>' : ''}
            ${issues.map(issue => `
                <div class="card" data-id="${issue.id}">
                    <h3>${issue.title}</h3>
                    <p>${issue.description}</p>
                    ${issue.response ? `<p><strong>Response:</strong> ${issue.response}</p>` : ''}
                    <button class="btn-danger remove-issue">Flag and Remove</button>
                </div>
            `).join('')}
        `;
    };

    const renderAdminView = () => {
        appRoot.innerHTML = `
            <h2>Admin Panel</h2>
            <div class="card">
                <h3>User Role Management</h3>
                <ul>
                    ${users.map(user => `
                        <li data-id="${user.id}">
                            ${user.name} - 
                            <select class="role-updater">
                                <option value="citizen" ${user.role === 'citizen' ? 'selected' : ''}>Citizen</option>
                                <option value="politician" ${user.role === 'politician' ? 'selected' : ''}>Politician</option>
                                <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    };

    // --- RENDER APP ---
    const renderApp = () => {
        const role = roleSelector.value;
        switch (role) {
            case 'citizen':
                renderCitizenView();
                break;
            case 'politician':
                renderPoliticianView();
                break;
            case 'moderator':
                renderModeratorView();
                break;
            case 'admin':
                renderAdminView();
                break;
            default:
                renderCitizenView(); // Default to citizen view
        }
    };

    // --- EVENT LISTENERS ---
    roleSelector.addEventListener('change', renderApp);

    // Using event delegation for dynamic elements
    appRoot.addEventListener('click', (e) => {
        // Politician: Save response and status
        if (e.target.classList.contains('save-response')) {
            const card = e.target.closest('.card');
            const issueId = parseInt(card.dataset.id);
            const issue = issues.find(i => i.id === issueId);

            if (issue) {
                issue.response = card.querySelector('.response').value;
                issue.status = card.querySelector('.status-selector').value;
                alert('Issue updated!');
                renderApp();
            }
        }
        
        // Moderator: Remove an issue
        if (e.target.classList.contains('remove-issue')) {
            const card = e.target.closest('.card');
            const issueId = parseInt(card.dataset.id);
            issues = issues.filter(i => i.id !== issueId);
            alert('Issue removed!');
            renderApp();
        }
    });

    appRoot.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload on form submission

        // Citizen: Report a new issue
        if (e.target.id === 'report-form') {
            const title = document.getElementById('issue-title').value.trim();
            const description = document.getElementById('issue-desc').value.trim();
            if (title && description) {
                const newIssue = {
                    id: Date.now(), // Use timestamp for a unique ID
                    title,
                    description,
                    citizenId: 101, // Simulated logged-in user
                    politicianId: 201, // Assign to a default politician
                    status: "Reported",
                    response: null
                };
                issues.push(newIssue);
                alert('Issue reported successfully!');
                renderApp();
            } else {
                alert('Please fill in all fields.');
            }
        }

        // Politician: Post a general update
        if (e.target.id === 'update-form') {
            const content = document.getElementById('update-content').value.trim();
            if (content) {
                const newUpdate = {
                    id: Date.now(),
                    content,
                    politicianName: "Councilor Jane Doe" // Simulated logged-in user
                };
                updates.push(newUpdate);
                alert('Update posted!');
                renderApp();
            } else {
                alert('Please enter update content.');
            }
        }
    });
    
    appRoot.addEventListener('change', (e) => {
        // Admin: Change a user's role
        if (e.target.classList.contains('role-updater')) {
            const listItem = e.target.closest('li');
            const userId = parseInt(listItem.dataset.id);
            const user = users.find(u => u.id === userId);
            if(user) {
                user.role = e.target.value;
                alert(`${user.name}'s role has been updated to ${user.role}.`);
                console.log(users);
            }
        }
    });

    // --- INITIAL RENDER ---
    renderApp();
});