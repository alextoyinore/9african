import React from 'react'
import InputBox from '../components/input.component'
import googleIcon from '../imgs/google.png'
import { Link, Outlet } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'

const UserAuthForm = ({type}) => {
  return (
    <AnimationWrapper keyValue={type}>
        <section className='h-cover flex items-center justify-center'>
            <form 
                action="" 
                className='w-[80%] max-w-[400px]'>
                    <h1 className='text-4xl font-gelasio capitalize text-center mb-8'>
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
                    className='btn-dark center mt-8 w-full'
                    type='submit'>
                        {type.replace('-', ' ')}
                    </button>

                    <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                        <hr className='w-1/2 border-black' />
                        <p>Or</p>
                        <hr className='w-1/2 border-black' />
                    </div>

                    <button className='btn-dark center w-[90%] capitalize flex items-center gap-4 justify-center'>
                        <img src={googleIcon} className='w-5' alt="Sign up with Google" />
                        continue with google
                    </button>

                    {
                        type == 'sign-in' ?
                        <p className='flex gap-1 mt-8 justify-center'>Don't have account? 
                            <Link to='/signup' className='underline text-black text-xl nl-1'>Sign Up</Link>
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
