import {Schema,model} from "mongoose"
import bcrypt  from 'bcryptjs'
import jwt from 'jsonwebtoken';
const userSchema=new Schema({
    fullName:{
        type:'String',
        required:[true,'Name is required'],
        minLength:[5,'Name must be of 5 character'],
        maxLength:[50,'Name should be less than 50 character'],
        lowercase:true,
        trim:true,//starting and ending space is trimmed
    },
    email:{
        type:'String',
        required:[true,'Email is required'],
        lowercase:true,
        trim:true,
        unique:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ], // Matches email against regex
    },
    password:{
        type:'String',
        required:[true,'Password is required'],
        minLength:[8,'Password must be of at least 8 character'],
        select:false //doesn't give access to password implicitly
    },

    avatar:{
        public_id:{
            type:'String',

        },
        secure_url:{
            type:'String',
        }
    },
    role:{
        type:'String',
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgetPasswordToken:{
        type:'String'
    },
    forgetPasswordExpiry:Date,
},{timeStamps:true})

userSchema.pre('save',async function(next){
    if (!this.isModified('password')){
        return next();;
    }
    this.password=await bcrypt.hash(this.password,10);
})

// creating userdefined methods for userSchema
userSchema.methods={
    generateJWtToken: async function(){
        return await jwt.sign(
            {id:this._id,email:this.email,subscription:this.subscription,role:this.role},//it is the the data stored in cookie
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY,
            }
        )
    },
    comparPassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password)
    }
    
}

const User=model('User',userSchema);

export default User;