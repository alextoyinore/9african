import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { BlogContext } from '../pages/Blog'
import CommentField from './CommentField'
import axios from 'axios';
import NoData from './NoData';
import CommentCard from './CommentCard';
import AnimationWrapper from '../common/page-animation';

export const CommentContext = createContext({})

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFunc, comment_array = null }) => {
    let res;

    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog-comments', { blog_id, skip })
    .then(({ data }) => {

        data.map(comment => {
            comment.childrenLevel = 0
        })

        setParentCommentCountFunc(preVal => preVal + data.length)

        if(comment_array == null) {
            res = { results: data }
        } else {
            res = { results: [ ...comment_array, ...data ] }
        }
    })

    return res
}

const Comments = () => {


    {
        /** Comment Context states */
    }
    let commentRef = useRef(null)

    let [ action, setAction ] = useState('') // For action being taken in comment textarea

    let [ replyingTo, setReplyingTo ] = useState({})   

    let [ isReplying, setIsReplying ] = useState(false)

    let [ commentIndex, setCommentIndex ] = useState(null)

    const resetCommentStates = () => {
        setAction('')
        setReplyingTo({})
        setIsReplying(false)
        setCommentIndex(null)
    }


    {
        /** Blog Context Destructure */
    }

    let {blog, setBlog, blog: {title, comments: { results: commentsArr }, activity: { total_parent_comments } }, commentWrapper, setCommentWrapper, totalParentCommentLoaded, setTotalParentCommentLoaded } = useContext(BlogContext)

    const loadMoreComments = async () => {
        let newCommentArr = await fetchComments({ skip: totalParentCommentLoaded, blog_id: blog._id, setParentCommentCountFunc: setTotalParentCommentLoaded, comment_array: commentsArr })

        setBlog({ ...blog, comments: newCommentArr })
    }


    return (
        
        <CommentContext.Provider value={{ commentRef, action, replyingTo, isReplying, setAction, setReplyingTo, setIsReplying, commentIndex, setCommentIndex, resetCommentStates }}>
            <div className={'max-sm:w-full fixed border border-grey '+ (commentWrapper ? 'max-sm:top-0 max-sm:right-0 top-[15%] right-[15%]': 'top-[100%] sm:right-[-100%] max-sm:top-[100%]') +' duration-700 max-sm:right-0 max-sm:top-0 top-[15%] w-[70%] right-[15%] min-w-[350px] max-sm:h-full h-[70%] z-50 bg-white shadow-xl px-8 md:px-8 overflow-y-auto overflow-x-hidden'}>
                <div className='sticky top-[0] w-full bg-white pb-2 pt-5'>
                    <div className='flex justify-between w-full items-center'>
                        <h1 className='text-2xl font-bold inline-block'>Conversations</h1>
                        <button
                            onClick={() => setCommentWrapper(preVal => !preVal)} 
                            className='items-center justify-center w-8 h-8 rounded-full flex bg-grey'>
                            <i className='fi fi-br-cross text-sm text-black'></i>
                        </button>
                    </div>
                    <p className='text-lg my-4 w-[80%] text-dark-grey line-clamp-1'>{title}</p>
                </div>

                <hr className='border-grey py-2 w-[120%] -ml-20' />

                    {
                        commentsArr && commentsArr.length ?
                        commentsArr.map((comment, index) => {
                            return <AnimationWrapper key={index}>
                                <CommentCard index={index} leftValue={comment.childrenLevel * 4} commentData={comment} />
                            </AnimationWrapper>
                        }) : <NoData message='Be the first to comment on this article' />
                    }

                    {
                        total_parent_comments > totalParentCommentLoaded ?
                        <button 
                            onClick={loadMoreComments}
                            className='hover:bg-grey rounded-full px-3 my-2 py-2'>Load More</button> : null
                    }

                <div className='sticky bg-white py-5 bottom-0 w-[100%] overflow-x-hidden'>
                    <CommentField />
                </div>

            </div>
        </CommentContext.Provider>
    )
}

export default Comments

