const monoogse=require('mongoose');

const taskSchema=new monoogse.Schema({

    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        trim:true,
        optional:true,
        default:false,
    },
    owner:{
        type:monoogse.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    }
  
  },
  {
      timestamps:true
  })

const task =monoogse.model('Tasks',taskSchema)

  module.exports=task