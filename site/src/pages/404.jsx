import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className='h-cover flex text-center justify-center items-center p-10 text-white mx-auto'>
        <div className='rounded-full p-[5em] bg-green w-[100vw] h-[100vw] lg:w-[40vw] lg:h-[40vw] flex flex-col justify-center items-center'>
            <h1 className='text-[4em] lg:text-[8em] font-black border-b border-white/50'>404</h1>
            <h2 className='font-medium border-b border-white/50 py-3'>Page Not Found</h2>
            <p className='py-3 w-[90%]'>Sorry! The page or resource you have requested cannot be found at the moment. Try refreshing the page is you believe this might be a network issue.</p>
        
            <Link to='/' className='text-white underline'>Go Home</Link>
        </div>

    </section>
  )
}

export default PageNotFound
