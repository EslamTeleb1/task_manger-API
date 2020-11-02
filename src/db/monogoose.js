
const monoogse=require('mongoose');


monoogse.connect(process.env.MONGODB_URL,{

useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology: true,
useFindAndModify:false
})



// const task =monoogse.model('Tasks',{

//     description:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         trim:true,
//         optional:true,
//         default:false,
//     },
  
//   })
  
//   const me = new task({
//          description:'         going   to college.' ,
//     completed:true
      
//   })
  
//   me.save().then((result)=>{
  
//       console.log(result)
//   }).catch((error)=>{
//       console.log(error)
//   })