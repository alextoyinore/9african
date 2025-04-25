import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation, { activeTabRef } from '../components/InPageNavigation'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPostCard'
import MinimalBlogCard from '../components/MinimalBlogCard'
import { Link } from 'react-router-dom'
import NoData from '../components/NoData'
import { filterPaginationData } from '../common/filter-pagination-data'
import LoadMore from '../components/LoadMore'


const Home = () => {

    let [blogs, setBlogs] = useState(null)
    let [trendingBlogs, setTrendingBlogs] = useState(null)
    let [topics, setTopics] = useState(null)
    let [pageState, setPageState] = useState('home')

    const fetchLatestBlogs = (page = 1) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs', { page })
        .then(async ({data}) => {
            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: '/all-blog-count',
                dataToSend: {}
            })            
            setBlogs(formatedData)            
        })
        .catch(err => {
            toast.error(err.message); 
        })
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/trending-blogs')
        .then(({data}) => {
            setTrendingBlogs(data.blogs)            
        })
        .catch(err => {
            toast.error(err.message); 
        })
    }

    const fetchPopularTags = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/get-popular-tags')
        .then(({data}) => {
            setTopics(data.tags)            
        })
        .catch(err => {
            toast.error(err.message); 
        })
    }

    const loadBlogByTag = (e) => {
        let tag = e.target.innerText.toLowerCase()
        setBlogs(null)
        
        if(pageState == tag) {
            setPageState('home')
            return
        }

        setPageState(tag)
    }

    useEffect(() => {

        activeTabRef.current.click()

        fetchLatestBlogs()         

        if(!trendingBlogs) {
            fetchTrendingBlogs()
        }

        if(!topics) {
            fetchPopularTags()
        }
        
    }, [pageState])

  return (
    <AnimationWrapper>
        <Toaster />
        <section className='h-cover flex justify-center lg:gap-10'>
            {/** Latest Blogs */}
            <div className='w-full'>
                <InPageNavigation 
                    routes={[pageState, 'trending']} 
                    defaultHidden={['trending']}
                >
                    <>
                        {
                            blogs == null ? <Loader /> :
                            blogs.results.length ? 
                            blogs.results.map((blog, index) => {
                                return (
                                    <AnimationWrapper 
                                        key={index}
                                        transition={{duration: 1, delay: index * .1}}
                                    >
                                        <BlogPostCard 
                                        content={blog} 
                                        author={blog.author.personal_info} />
                                    </AnimationWrapper>
                                )
                            })
                            : <NoData message='No data matches your query' />
                        }
                        <LoadMore 
                            state={blogs} 
                            fetchDataFunc= { 
                                pageState == 'home' ? fetchLatestBlogs : 
                                fetchBlogsByTag 
                            }
                        />
                    </>

                    <>
                        {
                            trendingBlogs == null ? <Loader /> :
                            trendingBlogs.length ? 
                            trendingBlogs.map((blog, index) => {
                                return (
                                    <AnimationWrapper 
                                        key={index}
                                        transition={{duration: 1, delay: index * .1}}
                                    >
                                        <MinimalBlogCard 
                                            content={blog} 
                                            author={blog.author.personal_info} 
                                            index={index} />
                                    </AnimationWrapper>
                                )
                            })
                            : <NoData message='No data matches your query' />
                        }
                    </>
                </InPageNavigation>
            </div>

            {/** Filters and trending blogs */}
            <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                <div className='flex flex-col mb-8'>
                    <h1 className='font-medium text-xl mb-8'>Popular Topics</h1>

                    <div className='flex flex-wrap gap-2'>
                        {
                            (topics && topics.length) ? 
                            topics.map((topic, index) => {
                                return (
                                    <Link
                                        to={'/topics/' + topic}
                                        key={index} className={'btn-light py-1.5 ' + (pageState == topic ? 'bg-black text-white' : '')}>{topic}
                                    </Link>
                                )
                            })
                            : <NoData message='No data matches your query' />
                        }
                    </div>
                </div>

                <div className='flex flex-col'>
                    <h1 className='font-medium text-xl mb-8 flex gap-2 items-center'>Trending Stories
                        <i className='fi fi-rr-arrow-trend-up'></i>
                    </h1>
                    <>
                        {
                            trendingBlogs == null ? <Loader /> :
                            trendingBlogs.length ? 
                            trendingBlogs.map((blog, index) => {
                                return (
                                    <AnimationWrapper 
                                        key={index}
                                        transition={{duration: 1, delay: index * .1}}
                                    >
                                        <MinimalBlogCard 
                                            content={blog} 
                                            author={blog.author.personal_info} 
                                            index={index} />
                                    </AnimationWrapper>
                                )
                            })
                            : <NoData message='No data matches your query' />
                        }
                    </>
                </div>
            </div>
        </section>
    </AnimationWrapper>
  )
}

export default Home

