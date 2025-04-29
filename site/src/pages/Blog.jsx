import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/Loader'
import UserCard from '../components/UserCard'
import { Link } from 'react-router-dom'
import { getDay, getFullDay } from '../common/date'
import BlogInteraction from '../components/BlogInteraction'
import NoData from '../components/NoData'
import BlogPostCard from '../components/BlogPostCard'

export const blogStructure = {
    title: '',
    des: '',
    banner: '',
    blog_id: '',
    tags: [],
    content: [],
    activity: {},
    publishedAt: '',
    author: {
        personal_info: {}
    }
}

export const BlogContext = createContext({})

const Blog = () => {

    let { id } = useParams()

    let [ blog, setBlog ] = useState(blogStructure)

    let [ loading, setLoading ] = useState(true)

    let [ similarBlogs, setSimilarBlogs ] = useState(null)

    let { title, des, content, banner, activity: { total_reads, total_likes }, publishedAt, blog_id, tags, author: { personal_info: { fullname, username, profile_img, bio }, social_links } } = blog

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', { blog_id: id })
        .then(({data: { blog }}) => {

            setBlog(blog)
                    
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { topic: blog.tags[0], limit: 3, subtract: blog_id })
            .then(({data: { blogs }}) => {
                setSimilarBlogs(blogs)
                console.log(blogs);
            })
            .catch(err => {
                toast.error(err.message)
            })

            setLoading(false)
        })
        .catch(err => {
            toast.error(err.message)
        })
    }

    const resetState = () => {
        setBlog(blogStructure)
        setLoading(true)
        setSimilarBlogs(null)
    }

    useEffect(() => {
        resetState()
        fetchBlog()
    }, [id])

    return (
        <AnimationWrapper>
            <Toaster />
            {
                loading ? <Loader /> :
                <BlogContext.Provider value={{ blog, setBlog }}>
                    <section className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                        <h2>{title}</h2>
                        <p className='text-black/60 italic my-5'>{des}</p>

                        <p className=' flex items-center gap-5 text-dark-grey my-5'>
                            <span className='flex items-center gap-2'><i className='fi fi-rr-calendar'></i> {getFullDay(publishedAt)}</span>

                            <span className='flex items-center gap-2'><i className='fi fi-rr-heart'></i> {total_likes} </span>

                            <span className='flex items-center gap-2'><i className='fi fi-rr-eye'></i> {total_reads} </span>
                        </p>

                        <img src={banner} alt={title} className='aspect-video' />

                        <div className='mt-12'>
                            <strong className='mb-5 block'>Published By</strong>
                            <UserCard content={{fullname, username, profile_img}} />
                            
                            <div className='text-dark-grey flex gap-x-5 gap-y-3 flex-wrap items-center'>
                                {
                                Object.keys(social_links).map((key) => {
                                        let link = social_links[key]

                                        return link.length ?
                                        <Link key={link} className='btn-light flex gap-2 items-center justify-center' target='_blank' to={link}>
                                            <i className={'fi ' + (key != 'website' ? 'fi-brands-' + key : 'fi-rr-globe') + 'text-2xl hover:text-black'}></i>
                                        </Link> : null
                                    })
                                }
                            </div>

                            <p className={'leading-7 text-black/60 italic mb-5 ' + (!bio.length ? 'text-dark-grey' : 'line-clamp-3')}>
                                {bio.length ? bio : 'Bio not available'}
                            </p>

                            <BlogInteraction />

                            {
                                // Blog Content
                            }

                            <BlogInteraction />

                            {
                                /** Tags */
                            }
                            <strong className='mt-12 block'>Topics</strong>
                            <div className='text-dark-grey mt-3 flex gap-x-5 gap-y-3 flex-wrap items-center'>
                                {
                                Object.keys(blog.tags).map((key) => {
                                        let tag = blog.tags[key]

                                        return tag.length ?
                                        <Link key={tag} className='btn-light flex gap-2 items-center text-sm justify-center' to={'/topics/' + tag}>
                                            { tag }
                                        </Link> : null
                                    })
                                }
                            </div>

                            {
                                similarBlogs != null && similarBlogs.length ?
                                <>
                                    <h1 className='mt-12 text-2xl mb-5 font-medium'>Similar to this post</h1>
                                    
                                    {
                                        similarBlogs.map((blog, index) => {

                                            let { author: { personal_info } } = blog

                                            return <AnimationWrapper key={index} transition={{duration: 1, delay: index * .1}}>
                                                {
                                                    blog.blog_id != blog_id ?
                                                    <BlogPostCard  content={blog} author={personal_info} />
                                                    : null
                                                }
                                                
                                            </AnimationWrapper>
                                        })
                                    }
                                </> : null
                            }

                        </div>

                    </section>
                </BlogContext.Provider>
            }
        </AnimationWrapper>
    )
}

export default Blog

