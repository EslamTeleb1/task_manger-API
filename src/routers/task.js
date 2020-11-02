const express=require('express');
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router= new express.Router();


router.get('/tasks/:id',auth,async(req,res)=>{

    const _id=req.params.id;
    try{

       //const task=await Task.findById(_id);

       const task = await Task.findOne({_id,owner:req.user._id})

       if(!task)
       {
        return res.status(404).send()
       }
       res.status(200).send(task)
    }
    catch(e)
    {
        res.status(500).send();
    }
    
    
})
router.get('/tasks',auth,async(req,res)=>{
    //res.send(req.user.tasks)
    const match={}
   ,sort={};
    if(req.query.completed)

    {
        
         match.completed = req.query.completed==='true'

    }

    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'dec' ? -1 : 1 ;

    }

    try{
       // const tasks = await Task.find({owner:req.user._id});
      await req.user.populate(
          {
              path:'tasks',
              match,
              options:{
                  limit:parseInt(req.query.limit),
                  skip:parseInt(req.query.skip),
                 sort
           }

    }).execPopulate();
        res.send(req.user.tasks)
    }
    catch(e){
        res.send(e)
    }
})


router.post('/tasks',auth,async(req,res)=>{

     //const task= new Task(req.body);

     const task=new Task({
         ...req.body,
         owner:req.user._id

     })

    try{

       await task.save(),

       res.status(201).send(task)

    }
    catch(e){
        res.send(error)
    }
})


router.patch('/tasks/:id',auth,async(req,res)=>{

    const updates = Object.keys(req.body);

    const AllowedUpdates = ['description','completed'];

    const isValidUpdates = updates.every((update)=>AllowedUpdates.includes(update));

    if(!isValidUpdates)

    {
        return res.status(404).send(" it's not valid updates !!! ")
    }

    try{

        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});

        if(!task)
        {
           return res.status(404).send('not a user')
        } 
        updates.forEach((update)=>task[update]=req.body[update]) 
        await task.save();
        res.send(task);
    }
    catch(e)
    {
        res.status(404).send(e)
    }
})


router.delete('/tasks/:id',auth,async(req,res)=>{

    const id=req.params.id;

    try{
        const task= await Task.findOneAndDelete({_id:id,owner:req.user._id});
        if(!task)
        {
            return res.status(404).send('Not Found')
        }
        res.send(task);
    }
     catch(e){

         res.status(500).send('Error : ' + e)

        }

})

module.exports=router;