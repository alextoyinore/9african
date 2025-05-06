'use client'

import React, { useContext, useState } from 'react'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import logo from '../imgs/logo.svg'
import icon from '../imgs/iconblack.svg'
import { UserContext } from '../App'
import UserNavigationPanel from './UserNavigation'

const Navbar = () => {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [ userNavPanel, setUserNavPanel ] = useState(false)

    const { userAuth: { token, profile_img } } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSearch = (e) => {
        let query = e.target.value

        if(e.keyCode == 13 && query.length) {
            navigate('/search/'+ query)
        }
    }

  return (
    <>
        <nav className='navbar'>
            <Link to='/' className='flex-none h-6'>
                <img src={logo} alt="" className='hidden text-black lg:block' />
                <img src={icon} alt="" className='h-8 w-15 lg:hidden' />
            </Link>

            <div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-3 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + (searchBoxVisibility ? 'show' : 'hide')}>
                <input 
                    type="text"
                    placeholder='Search'
                    onKeyDown={handleSearch}
                    className='w-full md:w-auto bg-grey p-3 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
                />

                <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>

            <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                <button 
                    onClick={() => setSearchBoxVisibility(currentValue => !currentValue)} 
                    className='md:hidden bg-grey w-10 h-10 rounded-full flex items-center justify-center'>
                    <i className='fi fi-rr-search text-xl text-dark-grey'></i>
                </button>

                <Link to='/editor' className='hidden md:flex gap-2 link'>
                    <p>Write</p>
                    <i className='fi fi-rr-file-edit'></i>
                </Link>

                {
                    token ?
                    <>
                        <Link to='/dashboard/notification'>
                            <button className='w-10 h-10 rounded-full bg-grey relative hover:bg-black/10'>
                                <i className='fi fi-rr-bell text-xl text-dark-grey block mt-1'></i>
                            </button>
                        </Link>

                        <div 
                            onClick={() => setUserNavPanel(currentValue => !currentValue)}
                            onBlur={() => {
                                setTimeout(() => {
                                    setUserNavPanel(false)
                                }, 200)
                            }}
                            className='relative'>
                            <button className='w-10 h-10 mt-1'>
                                <img src={profile_img} alt="" className='w-full h-full object-cover rounded-full' />
                            </button>
                            {
                                userNavPanel ?
                                <UserNavigationPanel /> : null
                            }
                        </div>
                    </>
                    :
                    <>
                        <Link to='/signin' className='btn-dark py-2'>
                            <p>Sign In</p>
                        </Link>

                        <Link to='/signup' className='hidden md:block btn-light py-2'>
                            <p>Sign Up</p>
                        </Link>
                    </>
                }
                
            </div>
        </nav>

        <Outlet />
    </>
    
  )
}

export default Navbar

