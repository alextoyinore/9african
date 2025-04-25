import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../pages/Editor'
import Tags from './Tags'
import axios from 'axios'
import { UserContext } from '../App'
import { useNavigate } from 'react-router-dom'

const PublishForm = () => {

    const characterLimit = 400
    const tagLimit = 15

    let { setEditorState, blog: {banner, title, tags, des, content }, blog, setBlog } = useContext(EditorContext)

    const { userAuth: { token } } = useContext(UserContext)

    const navigate = useNavigate()

    const handleCloseEvent = () => {
        setEditorState('editor')
    }

    const handleDesKeyDown = (e) => {
        // Prevent user from pressing enter key in title
        if(e.keyCode == 13) {
            e.preventDefault()
        }
    }

    const handleBlogTitleChange = (e) => {
        const input = e.target
        setBlog({...blog, title: input.value})
    }

    const handleUpdateDescription = (e) => {
        const input = e.target
        setBlog({...blog, des: input.value})
    }

    const handleKeyDown = (e) => {
       if(e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault()
            const tag = e.target.value

            if(tags.length < tagLimit) {
                if(!tags.includes(tag) && tag.length) {
                    setBlog({...blog, tags: [...tags, tag]})
                }
            } else {
                toast.error(`You cannot add more than ${tagLimit} topics`)
            }

            e.target.value = ''
       }
    }

    const publishBlog = (e) => {

        if(e.target.className.includes('disable')){
            return;
        }

        if(!title.length) {
            return toast.error('Your post needs a title')
        }

        if(!des.length || des.length > characterLimit) {
            return toast.error(`Your post needs an excerpt. If it does, then check that it does not go above the maximum character limit of ${characterLimit}`)
        }

        if(!tags.length) {
            return toast.error('Your post needs some tags.')
        }

        let loadingToast = toast.loading('Publishing...')

        // disable the publish button
        e.target.classList.add('disable')

        // send blog to server
        const blogObject = {
            title, banner, des, content, tags, draft: false
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/create-blog', blogObject, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast)

            toast.success('Published 👍')

            setTimeout(() => {
                navigate('/')
            }, 500)
        })
        .catch(({ response }) => {
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast)
            
            return toast.error(response.data.error)
        })
    }

  return (
    <AnimationWrapper>
        <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
            <Toaster />
            <button 
                className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]'
                onClick={handleCloseEvent}
            >
                <i className='ff fi-br-cross'></i>
            </button>

            <div className='max-w-[550px] center'>
                <p className='text-dark-grey mb-1'>Preview</p>
                <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
                    <img src={banner} alt="" />
                </div>

                <h1 className='text-2xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>

                <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{des}</p>
            </div>

            <div className='border-grey lg:border-1'>
                <p className='text-dark-grey mb-2 mt-9'>Post Title</p>
                <input 
                    type="text"
                    placeholder='Blog Title'
                    defaultValue={title}
                    className='input-box pl-4'
                    onChange={handleBlogTitleChange}
                />

                <p className='text-dark-grey mb-2 mt-9'>Post Excerpt</p>

                <textarea 
                    name="" 
                    id=""
                    maxLength={characterLimit}
                    defaultValue={des}
                    className='h-40 resize-none leading-7 input-box pl-4'
                    onChange={handleUpdateDescription}
                    onKeyDown={handleDesKeyDown}
                ></textarea>

                <p className='mt-1 text-dark-grey text-sm text-right'>{characterLimit - des.length} characters left</p>

                <p className='text-dark-grey mb-2 mt-9'>Topics/Tags - (Tags are words that describes the general idea or topic of your post)</p>

                <div className='relative input-box pl-2 py-2 pb-4'>
                    <input 
                        type="text"
                        placeholder='Tags'
                        className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white placeholder:text-dark-grey'
                        onKeyDown={handleKeyDown} 
                    />
                    {
                        tags.map((tag, index) => {
                            return <Tags tag={tag} tagIndex={index} key={index} />
                        })
                    }
                </div>
                <p className='mt-1 text-dark-grey text-sm text-right'>{tagLimit - tags.length} tags left</p>

                <button
                    onClick={publishBlog}
                    className='btn-dark px-8'
                >Publish</button>
            </div>
        </section>
    </AnimationWrapper>
  )
}

export default PublishForm

