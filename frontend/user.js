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
    let htmlData = '<div>'
    for(let i=0;i<response.data.length;i++){
        let user = response.data[i]
        htmlData += `<div>
        ${user.id} ${user.firstname} ${user.lastname}
        <a href='index.html?id=${user.id}'><button class="btn btn-warning btn-sm">Edit</button></a>
        <button class='delete btn btn-danger btn-sm' data-id='${user.id}'>Delete</button>
        </div>`
    }
    htmlData +='</div>'
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
}