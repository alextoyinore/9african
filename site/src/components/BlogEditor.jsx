import React, { createContext, useContext, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from '../imgs/logo.svg'
import icon from '../imgs/iconblack.svg'
import AnimationWrapper from '../common/page-animation'
import defaultBanner from '../imgs/blog banner.png'
import { uploadImage } from '../common/aws'
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../pages/Editor'
import EditorJS from '@editorjs/editorjs'
import { Tools } from './Tools'
import axios from 'axios'
import { UserContext } from '../App'
import { cloudinaryImageUpload } from '../common/cloudinary'


const BlogEditor = () => {

    const { userAuth: { token } } = useContext(UserContext)

    const navigate = useNavigate()

    let { blog_id } = useParams()

    let {
        blog, 
        blog: {title, banner, content, tags, des}, 
        setBlog,
        textEditor,
        setTextEditor,
        editorState,
        setEditorState
    } = useContext(EditorContext)

    // UseEffect
    useEffect(() => {
        if(!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holder: 'textEditor',
                tools: Tools,
                placeholder: 'Let\'s write something beautiful ...',
                data: Array.isArray(content) ? content[0] : content
            }))
        }
    }, [])

    const handleBannerUpload = (e) => {
        const image = e.target.files[0]
        if (image) {

            // Add toast to show image loading
            const uploadingToast = toast.loading('Uploading...')

            uploadImage(image)
            .then((url) => {
                if(url) {
                    toast.dismiss(uploadingToast)
                    toast.success('Uploaded👍')

                    setBlog({...blog, banner: url})
                }
            }).catch(err => {
                toast.dismiss(uploadingToast)
                return toast.error(err)
            })
        }
    }

    const handleCloudinaryBannerUpload = (e) => {
        const image = e.target.files[0]

        if (image) {

            // Add toast to show image loading
            const uploadingToast = toast.loading('Uploading...')

            // Check that image size is not greater than 1MB

            const maxSize = 1 * 1024 * 1024; // 1MB in bytes

            if (image.size > maxSize) {
                toast.dismiss(uploadingToast)

                return toast.error(`Image file size exceeds max size of ${maxSize}MB limit.`);
            }

            // Upload image
            cloudinaryImageUpload(image)
            .then((url) => {
                if(url) {
                    toast.dismiss(uploadingToast)
                    toast.success('Uploaded👍')

                    setBlog({...blog, banner: url})
                }
            }).catch(err => {
                toast.dismiss(uploadingToast)
                return toast.error(err)
            })
        }
    }

    const handleTitleKeyDown = (e) => {
        // Prevent user from pressing enter key in title
        if(e.keyCode == 13) {
            e.preventDefault()
        }
    }

    const handleTitleChange = (e) => {
        const input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + 'px'

        setBlog({ ...blog, title: input.value })
    }

    const handleImageError = (e) => {
        const image = e.target
        image.src = defaultBanner
    }

    const handlePublishBlog = () => {
        if(!banner.length) {
            return toast.error('You need to add a banner image to your post')
        }

        if(!title.length) {
            return toast.error('Your post needs a title')
        }

        if(textEditor.isReady) {
            textEditor.save()
            .then(data => {
                if(data.blocks.length) {
                  setBlog({...blog, content: data})
                  setEditorState('publish')
                } else {
                    return toast.error('Your post needs some body content')
                }
            })
            .catch(err => {
                return toast.error(err);
            })
        }
    }

    const handleSaveDraft = (e) => {
        if(e.target.className.includes('disable')){
            return;
        }

        if(!title.length) {
            return toast.error('Your draft needs a title')
        }

        let loadingToast = toast.loading('Saving your draft...')

        // disable the publish button
        e.target.classList.add('disable')

        // save editor content

        if(textEditor.isReady) {
            textEditor.save()
            .then(content => {

                // send blog to server
                const blogObject = {
                    title, banner, des, content, tags, draft: true
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/create-blog', {...blogObject, id: blog_id}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(() => {
                    e.target.classList.remove('disable')
                    toast.dismiss(loadingToast)
        
                    toast.success('Draft Saved 👍')
        
                    setTimeout(() => {
                        navigate('/')
                    }, 500)
                })
                .catch(({ response }) => {
                    e.target.classList.remove('disable')
                    toast.dismiss(loadingToast)
                    
                    return toast.error(response.data.error)
                })
            })
        }

    }

  return (
    <>
        <nav className='navbar'>
            <Link to='/' className='flex-none h-6'>
                <img src={logo} alt="" className='hidden lg:block' />
                <img src={icon} alt="" className='h-8 w-8 lg:hidden' />
            </Link>

            <p className='max-md:hidden text-black line-clamp-1 w-full'>
                {
                    title.length ? title : 'New Blog'
                }
            </p>

            <div className='flex gap-4 ml-auto'>
                <button 
                    className='btn-dark py-2 flex items-center'
                    onClick={handlePublishBlog}
                >
                    <span className=''>Publish</span>
                    <i className='fi fi-rr-send lg:hidden'></i>
                </button>
                <button 
                    className='btn-light py-2 flex items-center'
                    onClick={handleSaveDraft}
                >
                    <span className=''>Save Draft</span>
                    <i className='fi fi-rr-save lg:hidden'></i>
                </button>
            </div>
        </nav>
        <Toaster />
        <AnimationWrapper>
            <section className='flex flex-wrap lg:flex-nowrap lg:gap-20 w-full'>

                <div className='w-full md:w-[50%] md:pr-8 md:border-r border-grey md:sticky md:top-[50px] md:py-10'>

                    <textarea 
                        name="" 
                        id=""
                        placeholder='Enter title here...'
                        defaultValue={title}
                        className='text-3xl font-gelasio font-medium outline-none w-full h-20 resize-none mt-10 leading-tight placeholder:opacity-40'
                        onKeyDown={handleTitleKeyDown}
                        onChange={handleTitleChange}
                    ></textarea>

                    <hr className='opacity-10 mb-10' />

                    <div className='relative aspect-video bg-white border border-grey hover:opacity-80'>
                        <label htmlFor="uploadBanner">
                            <img
                                src={banner} 
                                alt="" className='z-20'
                                onError={handleImageError}
                            />
                            <input 
                                type="file" 
                                name="banner" 
                                id="uploadBanner"
                                accept='.jpg, .jpeg, .png, .webp' 
                                hidden
                                // onChange={handleBannerUpload}
                                onChange={handleCloudinaryBannerUpload}
                            />
                        </label>
                    </div>
                </div>
                <div className='w-full mt-10 lg:mt-4'>
                    <div id='textEditor' className='font-gelasio'></div>
                </div>
            </section>
        </AnimationWrapper>
    </>
  )
}

export default BlogEditor

