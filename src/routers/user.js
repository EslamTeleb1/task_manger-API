const express=require('express');
const User= require('../models/user');
const router=new express.Router();
const auth=require('../middleware/auth')
const multer=require('multer');
const sharp=require('sharp');
const {sendWelcomeEmail,sendGoodByeEmail}=require('../emails/account');



router.get('/test',(req,res)=>{

    res.send('from sepreted file !');
})

router.get('/users/me',auth,async(req,res)=>{

   res.send(req.user);
})


router.post('/users',async(req,res)=>{

  
    const user= new User(req.body);
    try{
        sendWelcomeEmail(user.email,user.name)
          await user.save();
        const token = await user.generateAuhtToken();
       res.status(201).send({user,token});
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

router.post('/users/login',async(req,res)=>{

      try{
        const user= await User.findByCredentails(req.body.email,req.body.password);

       const  token= await user.generateAuhtToken();

       res.status(200).send({user,token});
    }
    catch(e)
    {

        res.status(400).send(' '+e);
    }
})

router.post('/users/logout',auth,async(req,res)=>{

   // console.log('req.token : ',req.user.token);
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
           
           return token.token !==req.token });
        await req.user.save();
        res.send();
    }
    

    catch(e){
       
        res.status(500).send(e);
    }
})

router.post('/users/logoutall',auth,async(req,res)=>{

      try{

        req.user.tokens=[];

        await req.user.save();
        res.status(200).send();
      }
      catch(e)
      {
          res.status(500).send()
      }
        
})

router.patch('/users/me',auth,async(req,res)=>{

    const updates= Object.keys(req.body);

    const AllowedUpdates= ['name','email','password','age'];

    const isValidUpdates = updates.every((update)=>AllowedUpdates.includes(update));

    if(!isValidUpdates)
    {
        return res.status(404).send(" it's not valid updates !!! ")
    }

    try{

        // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

          // const req.user= await User.findById(req.user.id);

           updates.forEach((update)=>req.user[update]=req.body[update])

            await req.user.save();

        // if(!req.user)
        // {
        //    return res.status(404).send('not a user')
        // } 
        res.send(req.user);
    }
    catch(e)
    {
        res.status(404).send(e)
    }
})


router.delete('/users/me',auth,async(req,res)=>{

    const id=req.params.id;

    try{
        // const user= await User.findByIdAndDelete(req.user._id);
        // if(!user)
        // {
        //     return res.status(404).send('Not Found')
        // }
        await req.user.remove();
        sendGoodByeEmail(req.user.email,req.user.name)
        res.send(req.user);
    }
     catch(e){
         res.status(404).send('Error'+e)
     }
})

const upload = multer({

  //  dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cd){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cd(new Error('please ,upload an image file !!! '))
        }
        cd(undefined,true);
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{

    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();

    req.user.avatar=buffer;

    await req.user.save();
    res.status(200).send()
    
},(error,req,res,next)=>{

    res.status(400).send({error:error.message});
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    
    if(req.user.avatar)
    {
        req.user.avatar=undefined;
        await req.user.save();
        res.status(200).send()
    }

    res.status('400').send();
    
})
router.get('/users/:id/avatar',async(req,res)=>{

    try{

       const user= await User.findById(req.params.id);

       if(!user||!user.avatar)
       {
        res.status(404).send()
       }
       res.set('Content-Type','image/jpg')
       res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})

module.exports=router;