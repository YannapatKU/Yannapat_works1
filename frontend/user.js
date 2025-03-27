const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('Loading data...');

    try {
        // โหลด user ทั้งหมดจาก API
        const response = await axios.get(`${BASE_URL}/users`);
        console.log(response.data);

        // แสดง user ที่โหลดมาใน HTML
        const userDOW = document.getElementById('user');
        let htmlData = `
        <input type="text" id="search" class="form-control mb-3" placeholder="ค้นหาผู้ใช้..." oninput="searchUser()">
        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <table class="table table-bordered table-striped table-dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ชื่อ</th>
                        <th>นามสกุล</th>
                        <th>อายุ</th>
                        <th>เพศ</th>
                        <th>การจัดการ</th>
                    </tr>
                </thead>
                <tbody id="userTableBody">
        `;

        response.data.forEach(user => {
            htmlData += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.age}</td>
                    <td>${user.gender}</td>
                    <td>
                        <a href='index.html?id=${user.id}'><button class="btn btn-warning btn-sm">Edit</button></a>
                        <button class='delete btn btn-danger btn-sm' data-id='${user.id}'>Delete</button>
                    </td>
                </tr>
            `;
        });

        htmlData += `
                </tbody>
            </table>
        </div>
        `;

        userDOW.innerHTML = htmlData;

        // กำหนด event ให้ปุ่มลบ
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                if (confirm(`ต้องการลบผู้ใช้ ID ${id} ใช่หรือไม่?`)) {
                    try {
                        await axios.delete(`${BASE_URL}/users/${id}`);
                        loadData(); // โหลดข้อมูลใหม่
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                }
            });
        });

    } catch (error) {
        console.error('Error loading users:', error);
    }
};

// ฟังก์ชันค้นหาผู้ใช้
const searchUser = () => {
    const searchInput = document.getElementById('search').value.trim().toLowerCase();
    const rows = document.querySelectorAll('#userTableBody tr');

    rows.forEach(row => {
        const firstname = row.children[1].textContent.trim().toLowerCase();
        const lastname = row.children[2].textContent.trim().toLowerCase();

        if (firstname.includes(searchInput) || lastname.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};
