import React, { useContext } from 'react'
import InputBox from '../components/Input'
import googleIcon from '../imgs/google.png'
import { Link, Navigate } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import { emailRegex, passwordRegex } from '../regex'
import {Toaster, toast} from 'react-hot-toast'
import axios from 'axios'
import {storeSession} from '../common/session'
import { UserContext } from '../App'
import { authWithGoogle } from '../common/firebase'

const UserAuthForm = ({type}) => {

    const {userAuth: {token}, setUserAuth } = useContext(UserContext)

    const handleGoogleAuth = (e) => {
        e.preventDefault()

        authWithGoogle()
        .then(user => {
            const serverRoute = '/google-auth'
            const formData = {
                access_token: user.accessToken
            }
            submitDataToServer(serverRoute, formData)
        })
        .catch(err => {
            toast.error('We encountered a problem. Try again later.')
            return console.log(err);
        })
    }
    
    const submitDataToServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({data}) => {
            // console.log(data);
            storeSession('user', JSON.stringify(data))
            setUserAuth(data)
        }).catch(({response}) => {
            toast.error(response.data.error)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const serverRoute = type == 'sign-in' ? '/signin' : '/signup'

        // FormData
        const form = new FormData(authForm)
        let formData = {}

        for(let [key, value] of form.entries() ) {
            formData[key] = value
        }

        const {fullname, email, password} = formData
        
        // validate data from frontend
        if(fullname) {
            if(fullname.length < 3) {
                return toast.error('Your full name cannot be less than 3 letters')
            }
        }

        if(!email.length) {
            return toast.error('Email field cannot be empty')
        }

        if(!emailRegex.test(email)) {
            return toast.error('Please enter a valid email address')
        }

        if(!passwordRegex.test(password)) {
            return toast.error('Your password should be between 6 to 20 characters long. Should contain at least 1 lowercase and 1 uppercase letter, should contain at least one special character and should contain numeric characters.')
        }
        
        submitDataToServer(serverRoute, formData)
        
    }

    return (
        token ? <Navigate to='/' /> :
        <AnimationWrapper keyValue={type}>
            <section className='h-cover flex items-center justify-center'>
                <Toaster />
                <form
                    id='authForm'
                    action="" 
                    className='w-[80%] max-w-[400px]'>
                        <h1 className='text-3xl font-gelasio capitalize text-center mb-8'>
                            {type == 'sign-in' ? 'Welcome back' : 'Join Us Today' }
                        </h1>

                        {
                            type != 'sign-in' ?
                            <InputBox 
                                placeholder='Full Name' 
                                name='fullname' 
                                type='text' 
                                icon='user' /> : null
                        }

                        <InputBox 
                            placeholder='Email' 
                            name='email' 
                            type='email' 
                            icon='envelope' />
                        
                        <InputBox 
                            placeholder='Password' 
                            name='password' 
                            type='password' 
                            icon='lock' />

                        <button
                            onClick={handleSubmit}
                            className='btn-dark center mt-8 w-[]'
                            type='submit'>
                            {type.replace('-', ' ')}
                        </button>

                        <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                            <hr className='w-1/2 border-black' />
                            <p>Or</p>
                            <hr className='w-1/2 border-black' />
                        </div>

                        <button
                            onClick={handleGoogleAuth} 
                            className='btn-dark center capitalize flex items-center gap-4 justify-center'>
                            <img src={googleIcon} className='w-5' alt="Sign up with Google" />
                            google
                        </button>

                        {
                            type == 'sign-in' ?
                            <p className='flex gap-1 mt-8 justify-center'>Don't have account? 
                                <Link to='/signup' className='underline text-black nl-1'>Sign Up</Link>
                            </p> :
                            <p className='flex gap-1 mt-8 justify-center'>Already a reader? 
                                <Link to='/signin' className='underline text-black nl-1'>Sign In</Link>
                            </p>

                        }
                </form>
            </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm

