import React, { useContext, useEffect } from 'react'
import { BlogContext } from '../pages/Blog'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

const BlogInteraction = () => {

    let { blog, blog: {_id, blog_id, title, activity, activity: { total_likes, total_comments }, author: { personal_info: { username } } }, setBlog, likedByUser, setLikedByUser, setCommentWrapper } = useContext(BlogContext)

    let { userAuth: { username: loggedInUsername, token } } = useContext(UserContext)

    const handleLike = () => {
        if(token) {
            setLikedByUser(preVal => !preVal)

            !likedByUser ? total_likes++ : total_likes--

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/like-blog', { _id, likedByUser }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(({ data }) => {
                console.log(data);
            }).catch(err => {
                toast.error(err.message)
            })

            setBlog({
                ...blog,
                activity: {
                    ...activity, total_likes
                }
            })

        } else {
            toast.error('You are not logged in. Please sign in to like this article')
        }
    }

    useEffect(() => {
        if(token) {
             axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/liked-by-user', { _id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(({ data: { result } }) => {
                setLikedByUser(Boolean(result))
            }).catch(err => {
                toast.error(err.message)
            })
        }
    }, [])

    return (
        <>
            <Toaster />
            <hr className='border-grey my-2' />

                <div className='flex items-center gap-5 justify-between'>

                    <div className='flex gap-5'>
                        <div className='flex gap-2 items-center'>
                            <button 
                                onClick={handleLike}
                                className={'w-10 h-10 rounded-full center ' + (likedByUser ? 'bg-green/5 text-green' : 'bg-grey/80 ')}>
                                {
                                    !likedByUser ?  
                                    <i className={'fi fi-rr-heart'}></i>
                                    :  <i className={'fi fi-sr-heart'}></i>
                                }
                               
                            </button>
                            <span>{ total_likes }</span>
                        </div>

                        <div className='flex gap-2 items-center'>
                            <button 
                                onClick={() => setCommentWrapper(preVal => !preVal)}
                                className='w-10 h-10 rounded-full bg-grey/80 center'>
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

                        <Link target='_blank' to={"https://facebook.com/sharer/sharer.php?u=" + `${location.href}`} className='w-10 h-10 flex items-center justify-center'>
                            <i className='fi fi-brands-facebook text-2xl text-black/50 hover:text-green'></i>
                        </Link>

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

