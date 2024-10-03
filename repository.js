const params = new URLSearchParams(window.location.search);
const username = params.get('user');
const token = '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'; // Use GitHub token here

async function fetchUserDetails() {
    const url = `https://api.github.com/users/${username}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${token}` // Add Authorization header
        }
    });
    const user = await response.json();

    if (user) {
        document.getElementById('user-details').innerHTML = `
            <h2>${user.login}</h2>
            <img src="${user.avatar_url}" alt="${user.login}" width="100">
            <p>${user.bio ? user.bio : 'No bio available'}</p>
        `;

        fetchUserRepos(); // Call function to fetch repositories
    } else {
        document.getElementById('user-details').innerHTML = `<p>User not found</p>`;
    }
}

async function fetchUserRepos() {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${token}` // Add Authorization header
        }
    });
    const repositories = await response.json();
    
    if (repositories.length > 0) {
        displayRepositories(repositories);
    } else {
        document.getElementById('repositories').innerHTML = `<p>No repositories found</p>`;
    }
}

function displayRepositories(repositories) {
    const totalPages = Math.ceil(repositories.length / 12);
    let currentPage = 0;

    const updateRepos = (page) => {
        currentPage = page; // Update current page
        const start = page * 12;
        const paginatedRepos = repositories.slice(start, start + 12);
        document.getElementById('repositories').innerHTML = '';
        paginatedRepos.forEach(repo => {
            document.getElementById('repositories').innerHTML += `
                <div class="user">
                    <h3>${repo.name}</h3>
                    <p><i class="fas fa-star"></i>: ${repo.stargazers_count} <i class="fas fa-code-fork"></i>: ${repo.forks_count} <i class="fas fa-exclamation-circle"></i>: ${repo.open_issues_count}</p>
                    <p><i class="fas fa-language"></i>: ${repo.language ? repo.language : 'Not specified'} </p>
                    <p><i class="fas fa-clock"></i>: ${new Date(repo.updated_at).toLocaleDateString()}</p>
                    <button class="btn-download" onclick="downloadRepo('${repo.name}')">Download</button>
                </div>
            `;
        });
        setupRepoPagination(totalPages); // Call pagination setup
    }

    const setupRepoPagination = (totalPages) => {
        const paginationElement = document.getElementById('repo-pagination');
        paginationElement.innerHTML = ''; // Clear existing pagination
        // Add page buttons
        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i + 1;
            pageButton.onclick = () => updateRepos(i);
            // Check if the button is for the current page
            if (i === currentPage) {
                pageButton.classList.add('active'); // Add active class to current page button
            }
            paginationElement.appendChild(pageButton);
        }
        // Display current page
        const currentPageDisplay = document.createElement('div');
         paginationElement.appendChild(currentPageDisplay);
    }

    updateRepos(currentPage); // Show initial page
}

// Download repository
function downloadRepo(repoName) {
    const downloadUrl = `https://github.com/${username}/${repoName}/archive/refs/heads/main.zip`;
    window.location.href = downloadUrl; // Redirect to download
}

// Start fetching user details
fetchUserDetails();
