import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["recruiter", "candidate", "admin"],
      default: "candidate"
    },

    isApproved:{
      type:Boolean,
      default:function(){
        return this.role=="recruiter"? false:true
      }
    },

    skills: {
      type: [String],
      default:[]
    },

    experience:{
      type:String,
      default:""
    },

    location:{
      type:String,
      default:""
    },

    resume:{
      type:String
    },

    companyName: {
      type: String,
      default: ""
    },

  },
  { timestamps: true }
)

userSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {

  return await bcrypt.compare(enteredPassword, this.password)

}

export default mongoose.model("User", userSchema)