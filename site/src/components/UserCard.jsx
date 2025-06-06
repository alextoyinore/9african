import React from 'react'
import { Link } from 'react-router-dom'

const UserCard = ({content}) => {
    let { fullname, username, profile_img } = content
  return (
    <Link 
        to={'/user/' + username}
        className='flex gap-5 items-center mb-5'
    >
        <img src={profile_img} alt={fullname} className='w-14 h-14 rounded-full' />

        <div>
            <h1 className='font-medium text-xl line-clamp-2 capitalize'>{fullname}</h1>
            <p className='text-dark-grey text-sm'>@{username}</p>
        </div>
    </Link>
  )
}

export default UserCard

