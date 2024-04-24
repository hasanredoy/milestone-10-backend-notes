const express = require('express');

const app = express();

const cors = require('cors')


const port = process.env.PORT || 5000;



const user =[
  {id:1 , name:'hossain' , email:"hossain@gmail.com"},
  {id:2 , name:'hasan' , email:"hasan@gmail.com"},
  {id:3 , name:'redoy' , email:"redoy@gmail.com"},
]

app.use(express.json())

app.use(cors())

app.get('/', (req,res)=>{
  res.send('user management')
})


app.get('/users', (req, res)=>{
  res.send(user)
})

app.post('/users' ,(req , res)=>{
  console.log('data is hitting');
  console.log(req.body);
  const newUser = req.body;
  newUser.id = user.length + 1
  user.push(newUser)
  res.send(newUser)
})

app.listen(port , ()=>{
  console.log(`port : ${port}`);
})