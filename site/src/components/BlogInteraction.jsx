import React, { useContext } from 'react'
import { BlogContext } from '../pages/Blog'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'

const BlogInteraction = () => {

    let { blog: { blog_id, title, activity, activity: { total_likes, total_comments }, author: { personal_info: { username } } }, setBlog } = useContext(BlogContext)

    let { userAuth: { username: loggedInUsername } } = useContext(UserContext)

    return (
        <>
            <hr className='border-grey my-2' />

                <div className='flex items-center gap-5 justify-between'>

                    <div className='flex gap-5'>
                        <div className='flex gap-2 items-center'>
                            <button className='w-10 h-10 rounded-full bg-grey/80 center'>
                                <i className='fi fi-rr-heart'></i>
                            </button>
                            <span>{ total_likes }</span>
                        </div>

                        <div className='flex gap-2 items-center'>
                            <button className='w-10 h-10 rounded-full bg-grey/80 center'>
                                <i className='fi fi-rr-comment-dots'></i>
                            </button>
                            <span>{ total_comments }</span>
                        </div>
                    </div>
                    
                    <div className='flex gap-3 items-center'>

                        {
                           ( username == loggedInUsername) ?
                           <Link to={'/editor/' + blog_id} className='btn-light text-sm'>Edit Article</Link> : null
                        }

                        {/* <Link target='_blank' to={'https://twitter.com/intent/tweet?text=Read' + `${title}&url=${location.href}`} className='w-10 h-10 flex items-center justify-center'>
                            <i className='fi fi-brands-facebook text-2xl text-black/50 hover:text-green'></i>
                        </Link> */}

                        <Link target='_blank' to={'https://twitter.com/intent/tweet?text=Read' + `${title}&url=${location.href}`} className='w-10 h-10 flex items-center justify-center'>
                            <i className='fi fi-brands-twitter text-2xl text-black/50 hover:text-green'></i>
                        </Link>
                    </div>
                    
                </div>

            <hr className='border-grey my-2' />
        </>
    )
}

export default BlogInteraction

