import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/InPageNavigation'
import BlogPostCard from '../components/BlogPostCard'
import NoData from '../components/NoData'
import LoadMore from '../components/LoadMore'
import Loader from '../components/Loader'
import axios from 'axios'
import {toast, Toaster} from 'react-hot-toast'
import { filterPaginationData } from '../common/filter-pagination-data'
import { useParams } from 'react-router-dom'
import UserCard from '../components/UserCard'


const Search = () => {

    let  { query } = useParams()

    let [ blogs, setBlogs ] = useState(null)

    let [ users, setUsers ] = useState(null)

    const searchBlogs = (page = 1, createNewArray = true) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', {page, query})
        .then(async ({data}) => {
            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: '/search-blogs-count',
                dataToSend: {query},
                createNewArray
            })
            // console.log(formatedData);
            
            setBlogs(formatedData)            
        })
        .catch(err => {
            toast.error(err.message); 
        })
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-users', {query})
        .then(async ({data: {users}}) => {
            // console.log(users);
            setUsers(users)
        })
        .catch(err => {
            toast.error(err.message); 
        })
    }

    const resetState = () => {
        setBlogs(null)
        setUsers(null)
    }
 
    useEffect(() => {
        resetState()
        searchBlogs()
        fetchUsers()
    }, [query])

    return (
        <AnimationWrapper>
            <Toaster />
            <section className='h-cover flex justify-center lg:gap-10'>
                {/** Search Results */}
                <div className='w-full'>
                    <InPageNavigation 
                        routes={[`search results for "${query}"`, 'authors']} 
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
                                fetchDataFunc= {searchBlogs}
                            />
                        </>

                        <>
                            {
                                users == null ? <Loader /> :
                                users.length ? 
                                users.map((user, index) => {
                                    return (
                                        <AnimationWrapper 
                                            key={index}
                                            transition={{duration: 1, delay: index * .1}}
                                        >
                                            <UserCard 
                                                content={user.personal_info} 
                                            />
                                        </AnimationWrapper>
                                    )
                                })
                                : <NoData message='No data matches your query' />
                            }
                            {/* <LoadMore 
                                state={blogs} 
                                fetchDataFunc= {searchBlogs}
                            /> */}
                        </>
                    </InPageNavigation>
                </div>

                {/** Filters and trending blogs */}
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                    <>
                        {
                            users == null ? <Loader /> :
                            users.length ? 
                            users.map((user, index) => {
                                return (
                                    <AnimationWrapper 
                                        key={index}
                                        transition={{duration: 1, delay: index * .1}}
                                    >
                                        <UserCard 
                                            content={user.personal_info} 
                                        />
                                    </AnimationWrapper>
                                )
                            })
                            : <NoData message='No data matches your query' />
                        }
                        {/* <LoadMore 
                            state={blogs} 
                            fetchDataFunc= {searchBlogs}
                        /> */}
                    </>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Search

