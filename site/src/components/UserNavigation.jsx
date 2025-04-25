import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { removeSession } from '../common/session'

const UserNavigationPanel = () => {

    const { userAuth: {username}, setUserAuth } = useContext(UserContext)

    const signOutUser = () => {
        removeSession('user')
        setUserAuth({token: null})
    }

  return (
    <AnimationWrapper
        transition={{duration: .2}}
        className='absolute right-0 z-50'
    >
        <div className='bg-white absolute right-0 rounded border border-grey w-60 duration-200'>
            <Link to='/editor' className='flex gap-2 link md:hidden pl-8 py-4'>
                <i className='fi fi-rr-file-edit'></i>
                <p>Write</p>
            </Link>

            <Link to={`/user/${username}`} className='flex gap-2 link pl-8 py-4'>
                <i className='fi fi-rr-user'></i>
                <p>Profile</p>
            </Link>

            <Link to='/dashboard/blogs' className='flex gap-2 link pl-8 py-4'>
                <i className='fi fi-rr-dashboard'></i>
                <p>Dashboard</p>
            </Link>

            <Link to='/settings/edit-profile' className='flex gap-2 link pl-8 py-4'>
                <i className='fi fi-rr-settings'></i>
                <p>Settings</p>
            </Link>

            <span className='absolute border-t border-grey w-[100%]'></span>

            <button 
                onClick={signOutUser}
                className='text-left p-4 hover:bg-grey w-full pl-8 py-4'>
                <h1 className='font-bold text-xl mb-1'>Sign Out</h1>
                <p className='text-dark-grey'>@{username}</p>
            </button>

        </div>
    </AnimationWrapper>
  )
}

export default UserNavigationPanel

