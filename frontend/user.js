const BASE_URL = 'http://localhost:8000'

window.onload = async() =>{
    await loadData()
}

const loadData = async()=>{
console.log('on load')

    //1. load user all from api
    const response = await axios.get(`${BASE_URL}/users`)
    console.log(response.data)

    //2.นำuser ที่โหลดมาใส่กลับเข้าไปใน html
    const userDOW = document.getElementById('user')
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
            <tbody>
    `
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i]
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
        `
    }
    htmlData += `
            </tbody>
        </table>
    </div>
    `
    userDOW.innerHTML = htmlData
    
    const deleteDOMs = document.getElementsByClassName('delete')
    for (let i = 0;i < deleteDOMs.length; i++){
        deleteDOMs[i].addEventListener('click', async(event)=>{
            //ดึงค่าid จาก attribute ของปุ่ม delete
            const id = event.target.dataset.id
            try{
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData()
            }catch(error){
                console.error(error)
            }
        })
    }
    const searchUser = () => {
        const searchInput = document.getElementById('search').value.toLowerCase();
        const rows = document.querySelectorAll('#userTableBody tr');
    
        rows.forEach(row => {
            const firstname = row.children[1].textContent.toLowerCase();
            const lastname = row.children[2].textContent.toLowerCase();
    
            if (firstname.includes(searchInput) || lastname.includes(searchInput)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}