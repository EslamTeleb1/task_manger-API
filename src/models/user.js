import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Task from './task';

const userSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
        },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
              }
        }
    ],
    avatar:{
        type:Buffer
    }
    
},{
    timestamps:true
})


userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:"_id",
    foreignField:"owner"

})

userSchema.methods.toJSON = function(): any {
 
    const user=this;
    const userObject= user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;

}

// hash the plain text before saving it
userSchema.methods.generateAuhtToken = async function(): Promise<string> {

const user=this;

const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

user.tokens = user.tokens.concat({token});

   await user.save();

  return token;

}

userSchema.statics.findByCredentails= async(email: string, password: string): Promise<User> {

    const user= await User.findOne({email});

    if(!user)
    {
        throw new Error('Unable to login');
    }

  const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch)
    {
        throw new Error('Unable to login');

    }
    return user;


}


userSchema.pre('save',async function(next){

    const user=this;
   //console.log('just before saving...');

    if(user.isModified('password'))
    {
            user.password= await bcrypt.hash(user.password,8);  
    }
    
    next();
})

userSchema.pre('remove',async function(next){

    const user=this;

    await Task.deleteMany({owner:user._id})

    next()
})

const User = mongoose.model('users',userSchema)

export default User;