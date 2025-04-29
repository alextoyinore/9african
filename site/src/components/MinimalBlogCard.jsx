import React from 'react'
import { getDay } from '../common/date'
import { Link } from 'react-router-dom'

const MinimalBlogCard = ({content, author, index}) => {

    let {title, des, blog_id, banner, tags, publishedAt, activity: {total_likes}} = content

    let {fullname, username, profile_img} = author

    return (
        <div>
            <div className='flex gap-5 mb-8'>
                <h1 className='blog-index'>{ index < 10 ? '0' + (index + 1) : (index + 1) }</h1>

                <div>
                    <div className='flex gap-2 items-center mb-3'>
                        <Link to={'/user/' + username} className='flex gap-2 items-center'>
                            <img src={profile_img} alt={fullname} className='rounded-full w-6 h-6' />
                            <p className='line-clamp-1'>{fullname} @{username}</p>
                        </Link>
                        <p className='line-clamp-1'>{getDay(publishedAt)}</p>
                    </div>

                    <Link to={'/blog/' + blog_id} className='blog-title text-xl'>{title}</Link>

                </div>
            </div>
        </div>
    )
}

export default MinimalBlogCard

