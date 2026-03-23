import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import dns from 'node:dns/promises'
import connectDB from '../config/db.js'
dns.setServers(['1.1.1.1','8.8.8.8'])
dotenv.config()
const createAdmin=async()=>{
    try{
        await connectDB()
        const adminExists=await User.findOne({email:'admin@gmail.com'})
        if(adminExists){
            console.log('Admin already exists')
            process.exit(0)
        }
        await User.create({
            name:'Amrishaa',
            email:'admin@gmail.com',
            password:'admin123',
            role:'admin'
        })
        console.log('Admin created successfully')
        process.exit()
    }catch(error){
        console.error(error)
        process.exit(1)
    }
}
createAdmin()