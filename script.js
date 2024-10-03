// Valid random users
const randomUsers = [
    'octocat', 'torvalds', 'mojombo', 'defunkt', 'pjhyett',
    'wycats', 'ezra', 'tenderlove', 'benblume',
    'sindresorhus', 'addyosmani', 'gaearon', 'kentcdodds',
    'mpjme', 'vladikoff', 'jakearchibald', 'matthewlein', 'juliangruber',
    'mikeal', 'michaeljclark', 'kristianmandrup', 'benbahrenburg', 'mariko',
    'rexxars', 'whatsupguys', 'ilyakatz', 'michaelfreeman',
    'ericelliott', 'andrewsuzuki', 'adrianh', 'mattdiamond'
];

let currentPage = 0;
const usersPerPage = 12; // 4x3
const suggestionCount = 4;
const token = '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'; // ใส่ Token ที่สร้างขึ้นที่นี่

// Search function
async function getUser() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        displayRandomUsers();
    } else {
        await fetchUsers(username);
    }
}

// Fetch users based on search
async function fetchUsers(username) {
    const url = `https://api.github.com/search/users?q=${username}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}` // เพิ่ม Authorization header
            }
        });
        const data = await response.json();

        if (response.ok) { // ตรวจสอบสถานะการตอบกลับ
            if (data.total_count > 0) {
                displayProfiles(data.items);
            } else {
                document.getElementById('profile').innerHTML = `<p>No users found</p>`;
            }
        } else {
            console.error('Error fetching users:', data.message);
            document.getElementById('profile').innerHTML = `<p>Error fetching users: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('profile').innerHTML = `<p>Error fetching users</p>`;
    }
}

// Display profiles in grid
async function displayProfiles(users) {
    const totalPages = Math.ceil(users.length / usersPerPage);
    const paginatedUsers = users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);
    
    document.getElementById('profile').innerHTML = '';
    for (const user of paginatedUsers) {
        const repoCount = await fetchRepoCount(user.login); // เรียกจำนวน repository ที่นี่
        document.getElementById('profile').innerHTML += `
            <div class="user">
                <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
                <h2>${user.login}</h2>
                <p>Repositories: ${repoCount}</p>
                <button onclick="viewRepository('${user.login}')">View Repository</button>
                <button onclick="viewProfile('${user.login}')">View Profile</button>
            </div>
        `;
    }

    setupPagination(totalPages);
}

// Fetch repository count
async function fetchRepoCount(username) {
    const url = `https://api.github.com/users/${username}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}` // เพิ่ม Authorization header
            }
        });
        if (!response.ok) {
            console.error('Error fetching user data:', await response.text());
            return 0; // หากเกิดข้อผิดพลาดให้คืนค่า 0
        }
        const userData = await response.json();
        return userData.public_repos; // Return the number of public repositories
    } catch (error) {
        console.error('Error fetching repository count:', error);
        return 0; // หากเกิดข้อผิดพลาดให้คืนค่า 0
    }
}

// Pagination setup
function setupPagination(totalPages) {
    document.getElementById('pagination').innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        document.getElementById('pagination').innerHTML += `<button onclick="changePage(${i})">${i + 1}</button>`;
    }
}

// Change page
function changePage(page) {
    currentPage = page;
    getUser(); // Re-fetch users for the current page
}

// Display random users
function displayRandomUsers() {
    currentPage = 0; // Reset to the first page
    const randomUserNames = randomUsers.sort(() => 0.5 - Math.random()).slice(0, suggestionCount);
    document.getElementById('suggestions').innerHTML = '';

    randomUserNames.forEach(user => {
        document.getElementById('suggestions').innerHTML += `
            <div class="suggestion" onclick="viewProfile('${user}')">
                <img src="https://github.com/${user}.png" alt="${user}" class="avatar">
                <p>${user}</p>
            </div>
        `;
    });
}

/*// Navigate to repository page
function viewRepository(username) {
    window.location.href = `repository.html?user=${username}`;
}
*/
// Navigate to repository page
function viewRepository(username) {
    window.open(`repository.html?user=${username}`, '_blank'); // เปิดหน้าใหม่
}

// Navigate to profile page
function viewProfile(username) {
    window.open(`https://github.com/${username}`, '_blank'); // Open in a new tab
}

// Initialize the random users display
displayRandomUsers();
