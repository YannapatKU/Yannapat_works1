const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise')
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = 8000;
// สำหรับเก็บ users
let users = []
let counter = 1;

let conn = null
const initMySQL = async () => {
 conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8700
  })
}

const validateData = (userData) => {
  let errors = []
  if (!userData.firstname) {
      errors.push('กรุณากรอกชื่อ')
  }
  if (!userData.lastname) {
      errors.push('กรุณากรอกนามสกุล')
  }
  if (!userData.age) {
      errors.push('กรุณากรอกอายุ')
  }
  if (!userData.gender) {
      errors.push('กรุณาเลือกเพศ')
  }
  if (!userData.interests) {
      errors.push('กรุณาเลือกความสนใจ')
  }
  if (!userData.description) {
      errors.push('กรุณากรอกคำอธิบาย')
  }
  return errors
}

 // path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา 1.
app.get('/users', async(req, res) => {
  const results = await conn.query('SELECT * FROM users')
  res.json(results[0])
})

// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป 2.
app.post('/users', async(req, res) => {
  try{
    let user = req.body; 
    const errors = validateData(user)
    if (errors.length > 0){
      throw {
        message: 'กรอกข้อมูลไม่ครบ',
        errors: errors
      }
      }    
    const results = await conn.query('INSERT INTO users SET ?',user)
    res.json({
      message: 'Create new user successfully',
      data:results[0]
    })
  }catch (error){
    const errorMessage = error.errors || 'something went wrong'
    const errors = error.errors || []
    console.log('errorMessage',error.message)
    res.status(500).json({
      message: errorMessage,
      errors: errors
    })
  }
})

// path = GET /users/:id สำหรับการดึง users รายคนออกมา 3.
app.get('/users/:id', async(req, res) => {
  try{
    let id = req.params.id
    const results = await conn.query('SELECT * FROM users WHERE id = ?',id)

    if(results[0].length == 0 ){
      throw { statusCode: 404,message: 'User not found'}   
    }
      res.json(results[0][0]);

  }catch (error){
    console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something went wrong'
    })
  }
})


//path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป) 4.
app.put('/users/:id', async(req, res) => {

  try{
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query('UPDATE users SET ? WHERE id = ?',[updateUser,id])
    res.json({
      message: 'Update user successfully',
      data:results[0]
    })
  }catch (error){
    console.log('errorMessage',error.message)
    res.status(500).json({
      message: 'something went wrong'
    })
  }
})

// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป) 5.
app.delete('/users/:id', async(req, res) => {
  try{
    let id = req.params.id;
    const results = await conn.query('DELETE FROM users WHERE id = ?',id)
    res.json({
      message: 'DELETE user successfully',
      data:results[0]
    })
  }catch (error){
    console.log('errorMessage',error.message)
    res.status(500).json({
      message: 'something went wrong'
    })
  }  
})

app.listen(port, async(req, res) => {
  await initMySQL()
    console.log('http server running on', + port);
})