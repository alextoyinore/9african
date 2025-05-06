import React, { useContext, useState, useEffect } from 'react'
import { getFullDay } from '../common/date'
import { toSentenceCase } from '../common/utils-funcs'
import { UserContext } from '../App'
import toast from 'react-hot-toast'
import { CommentContext } from './Comments'


const CommentCard = ({ index, commentData }) => {

    let { _id: commentReplyingTo, parent, commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment } = commentData

    if(parent != undefined) {
        let parent_fullname = commentData.parent.commented_by.personal_info.fullname
        let parent_username = commentData.parent.commented_by.personal_info.username
        commentData = { ...commentData, parent: { parent_fullname, parent_username } }
    }else {
        let parent_fullname = null
        let parent_username = null
        commentData = { ...commentData, parent: { parent_fullname, parent_username } }
    }

    let { userAuth: { token, username: loggedInUser } } = useContext(UserContext)

    let { action, isReplying, commentRef, replyingTo, setAction, setReplyingTo, setIsReplying, commentIndex, setCommentIndex, resetCommentStates } = useContext(CommentContext)


    // console.log('parent', commentData.parent.parent_fullname);
    

    const handleReplyComment = () => {
        if(!token) {
            return toast.error('You have to be logged to comment or reply')
        }

        if(!isReplying) {
            setIsReplying(prevState => !prevState)

            commentRef.current?.focus()
    
            setAction('reply')
    
            setReplyingTo({
                fullname, // comment author's fullname
                username, // comment authors username
                commentReplyingTo // id of the comment not the comment author
            })

            setCommentIndex(index)
            
        } else {
            resetCommentStates()
        }

    }

    const handleDeleteComment = () => {
        
    }


    return (

        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 my-2 items-start'>
                <img src={profile_img} alt={fullname} className='w-8 h-8 rounded-full' />
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-2 flex-wrap items-center font-medium'>
                        {
                            commentData.parent.parent_fullname && <span className='py-1 p-4 bg-green/20 text-sm rounded-full'>Replying: @{commentData.parent.parent_fullname}</span>
                        }
                        <span className='capitalize text-sm'>{fullname}</span>
                        <span className='text-sm'>{getFullDay(commentedAt)}</span>
                    </div>
                    <div className=''>{toSentenceCase(comment)}</div>
                    <div className='flex gap-5 mt-2 text-sm'>
                        <button 
                            onClick={handleReplyComment}
                            className='flex gap-1 items-center hover:text-green text-dark-grey'>
                            <i className="fi fi-br-reply-all text-sm"></i>
                            Reply
                        </button>

                        {
                            (loggedInUser == username) && 
                            <button 
                                onClick={handleDeleteComment}
                                className='flex gap-1 items-center hover:text-green text-dark-grey'>
                                <i className="fi fi-rr-trash"></i>
                                Delete
                            </button>
                        }
                    </div>
                </div>
            </div>
            <hr className='border-grey' />
        </div>
    )
}

export default CommentCard

