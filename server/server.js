import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import User from './Schema/User.js'

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


const server = express()
server.use(express.json())

const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    },
    dbName: '9african'
}


try{
    mongoose.connect(process.env.DB_CONNECTION_STRING, clientOptions, {
        autoIndex: true,
    })
    console.log('Connected to mongodb')
} catch (error) {
    console.error('Error occured while attempting to connect to mongodb', error.message);
    throw error;
}

server.post('/signup', (req, res) => {
    const {fullname, email, password} = req.body
    // validate data from frontend
    if(fullname.length < 3) {
        return res.status(403).json({'error': 'Your full name cannot be less than 3 letters'})
    }

    // if(!email.length) {
    //     return res.status(403).json({'error': 'You need to enter an email address'})
    // }

    if(!emailRegex.test(email)) {
        return res.status(403).json({'error': 'Please enter a valid email address'})
    }

    if(!passwordRegex.test(password)) {
        return res.status(403).json({'error': 'Your password should be between 6 to 20 characters long. Should contain at least 1 lowercase and 1 uppercase letter, should contain at least one special character and should contain numeric characters.'})
    }

    bcrypt.hash(password, 10, (err, hashed_password) => {
        // console.log(hashed_password)
        const username = email.split('@')[0]
        const user = new User({
            personal_info: {
                fullname,
                email,
                password: hashed_password,
                username
            }
        })
        user.save().then((data)=>{
            return res.status(200).json({user: data})
        }).catch(err => {
            return res.status(500).json({'error': err.message})
        })
    })
})


const PORT = 3030

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

