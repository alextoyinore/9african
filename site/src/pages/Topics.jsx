import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/InPageNavigation'
import BlogPostCard from '../components/BlogPostCard'
import NoData from '../components/NoData'
import LoadMore from '../components/LoadMore'
import Loader from '../components/Loader'
import axios from 'axios'
import {toast, Toaster} from 'react-hot-toast'
import { filterPaginationData } from '../common/filter-pagination-data'


const Topics = () => {
    let  { topic } = useParams()

    let [blogs, setBlogs] = useState(null)

    const fetchBlogsByTopic = (page = 1, createNewArray = true) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { page, topic})
        .then(async ({data}) => {
            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: '/topic-blogs-count',
                dataToSend: { topic },
                createNewArray
            })            
            // console.log(formatedData);
            
            setBlogs(formatedData)            
        })
        .catch(err => {
            toast.error(err.message); 
        })
    }

    useEffect(() => {
      fetchBlogsByTopic()
    }, [topic])

    return (
        <AnimationWrapper>
            <Toaster />
            <section className='h-cover flex justify-center lg:gap-10'>
                {/** Search Results */}
                <div className='w-full'>
                    <InPageNavigation 
                        routes={[topic, 'authors']} 
                        defaultHidden={['authors']}
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
                                fetchDataFunc= {<></>}
                            />
                        </>

                        <></>
                    </InPageNavigation>
                </div>

                {/** Filters and trending blogs */}
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>

                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Topics
