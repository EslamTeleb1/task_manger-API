const express=require('express');
require('./db/monogoose');
const app=express();
const port=process.env.PORT;
const userRouter=require('../src/routers/user')
const taskRouter=require('../src/routers/task')

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);
app.listen(port,()=>{

    console.log('Server is up  on port : ' + port)
})
