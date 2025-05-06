import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import toast, { Toaster } from 'react-hot-toast'
import { BlogContext } from '../pages/Blog'
import axios from 'axios'
import { toSentenceCase } from '../common/utils-funcs'
import { CommentContext } from './Comments'


const CommentField = () => {

    let [ comment, setComment ] = useState('')

    let { userAuth: { token, username, profile_img, fullname } } = useContext(UserContext)

    let { blog, setBlog, setTotalParentCommentLoaded, blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentsArr }, activity, activity: { total_comments, total_parent_comments } } } = useContext(BlogContext)


    let { action, isReplying, commentRef, replyingTo, replyingTo:{ fullname: commentAuthorName, username: commentAuthorUsername, commentReplyingTo }, setAction, setReplyingTo, setIsReplying, commentIndex, setCommentIndex, resetCommentStates } = useContext(CommentContext)


    const handleComment = () => {
        if(!token) {
            return toast.error('You need to login to comment on this article')
        }

        if(!comment.length) {
            return toast.error('Your comment cannot be empty')
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/add-comment', {
            _id, blog_author, comment, replying_to: commentReplyingTo
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ data }) => {

            setComment('')
            
            data.commented_by = { personal_info: { username, profile_img, fullname } }

            let newCommentsArr;

            if(commentReplyingTo) {
                
                commentsArr[commentIndex].children.push(data._id)

                data.childrenLevel = commentsArr[commentIndex].childrenLevel + 1

                data.parentIndex = commentIndex

                commentsArr[commentIndex].isReplyLoaded = true

                commentsArr.splice(commentIndex + 1, 0, data)

                newCommentsArr = commentsArr
                
            } else {

                data.childrenLevel = 0

                newCommentsArr = [ data, ...commentsArr ]
            }
            
            let parentCommentIncrementVal = commentReplyingTo ? 0 : 1

            setBlog({
                ...blog,
                comments: { ...comments, results: newCommentsArr },
                activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrementVal }
            })

            setTotalParentCommentLoaded(preVal => preVal + parentCommentIncrementVal)
            
        }).catch(err => {
            toast.error(err.message)
        })

        resetCommentStates()
    }


    useEffect(() => {
        resetCommentStates()
    }, [])


    return (
        <>

            <div className='relative'>
                {
                    (isReplying) && 
                    <span className='absolute z-10 text-sm top-3 left-3 rounded-lg px-2 py-1 bg-green/80 text-black flex items-center gap-2'>Replying to: 
                        <b className='text-sm'>{ toSentenceCase(commentAuthorName) }</b>
                        <button
                            onClick={resetCommentStates} 
                            className='items-center justify-center flex text-sm'>
                            <i className='fi fi-br-cross text-[8px] text-black'></i>
                        </button>
                    </span>
                }

                <textarea 
                    ref={commentRef}
                    onChange={(e) => setComment(e.target.value)}
                    className={'input-box pl-3 '+ (isReplying ? 'pt-12' : '')+ ' placeholder:text-dark-grey resize-none h-[100px] md:h-[50px] overflow-auto'}
                    placeholder='Your comment here...'
                    value={comment}>
                </textarea>

                {
                    <button 
                        onClick={handleComment}
                        className='text-xl text-white absolute right-3 bottom-4 lg:bottom-4 w-10 h-10 bg-green p-1 rounded-full flex items-center justify-center'>
                        <i className={"fi " + (action != 'reply' ? "fi-ss-paper-plane" : "fi-br-reply-all") + " text-xl"}></i>
                    </button>
                }

            </div>
            
        </>
    )
}

export default CommentField

