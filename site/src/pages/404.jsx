import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className='h-cover flex text-center justify-center items-center p-10'>
        <div className='rounded-full p-[4em] w-[90vw] md:w-[50vw] flex flex-col justify-center items-center'>
            <h1 className='text-[8em] font-black border-b border-white/50'>404</h1>
            <h2 className='font-medium border-b border-white/50 py-3'>Page Not Found</h2>
            <p className='py-3 w-[90%]'>Sorry! The page or resource you have requested cannot be found at the moment. Try refreshing the page is you believe this might be a network issue.</p>
        
            <Link to='/' className='underline'>Go Home</Link>
        </div>

    </section>
  )
}

export default PageNotFound
