import React from 'react'
import { getDay } from '../common/date'
import { Link } from 'react-router-dom'

const BlogPostCard = ({content, author}) => {

    let {title, des, blog_id: id, banner, tags, publishedAt, activity: {total_likes}} = content
    let {fullname, username, profile_img} = author

    return (
        <div 
            className='flex justify-between gap-8 border-b border-grey pb-5 mb-5 items-center'
        >
            <div className='w-full'>
                <div className='flex gap-2 items-center mb-7'>
                    <img src={profile_img} alt={fullname} className='rounded-full w-6 h-6' />
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <p className='line-clamp-1'>{getDay(publishedAt)}</p>
                </div>

                <Link  to={'/blog/'+id}>
                    <div>
                        <h1 className='blog-title'>{title}</h1>
                        <p className='font-gelasio text-xl my-3 leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{des}</p>
                    </div>
                    
                </Link>

                <div className='flex items-center gap-4 mt-7'>
                    <Link to={'/topics/' + tags[0]} className='btn-light py-1 px-4'>{tags[0]}</Link>
                    <span className='flex items-center ml-3 gap-2 text-dark-grey'>
                        <i className='fi fi-rr-heart text-xl'></i>
                        {total_likes}
                    </span>
                </div>
            </div>

            <div className='h-28 aspect-square bg-grey'>
                <img src={banner} alt={title} className='w-full h-full aspect-square object-cover' />
            </div>
        </div>
    )
}

export default BlogPostCard

