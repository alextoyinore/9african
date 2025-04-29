import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/Loader'
import { UserContext } from '../App'
import AboutUser from '../components/About'
import { filterPaginationData } from '../common/filter-pagination-data'
import BlogPostCard from '../components/BlogPostCard'
import NoData from '../components/NoData'
import InPageNavigation from '../components/InPageNavigation'
import LoadMore from '../components/LoadMore'
import PageNotFound from './404'


export const profileDataStructure = {
    "personal_info": {
        "fullname": "",
        "email": "",
        "username": "",
        "profile_img": "",
        "bio": ""
    },
  "social_links": {
    "youtube": "",
    "instagram": "",
    "facebook": "",
    "twitter": "",
    "github": "",
    "website": ""
  },
  "account_info": {
    "total_posts": 0,
    "total_reads": 0
  },
  "_id": "",
  "joinedAt": "",
}

const Profile = () => {

    let { username } = useParams()

    let { userAuth: { username: loggedInUser } } = useContext(UserContext)

    let [profile, setProfile] = useState(profileDataStructure)

    let [ blogs, setBlogs ] = useState(null)

    let [ profileLoaded, setProfileLoaded ] = useState('')

    let { personal_info: { fullname, username: profileId, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile

    let [ loading, setLoading ] = useState(true)

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-profile', { username })
        .then(({ data: user }) => {
            if(user != null) {
                setProfile(user)
            }
            setProfileLoaded(username)
            fetchUserBlogs({ userID: user._id })
            setLoading(false)
        })
        .catch(err => {
            toast.error(err.message)
            setLoading(false)
        })
    }

    const fetchUserBlogs = ({ page = 1, userID, createNewArray = true }) => {

        userID = userID == undefined ? blogs.userID : userID

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { author: userID, page })
        .then(async ({ data }) => {
            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: '/search-blogs-count',
                dataToSend: { author: userID },
                createNewArray
            })

            formatedData.userID = userID

            setBlogs(formatedData)   
        
        })
        .catch(err => {
            toast.error(err.message); 
        })

        // console.log(blogs);
    }

    const resetState = () => {
        setProfile(profileDataStructure)
        setLoading(true)
        setProfileLoaded('')
    }

    useEffect(() => {
        resetState()
        fetchUserProfile()
    }, [username])

    return (
        <AnimationWrapper>
            <Toaster />
            
                {
                    loading ? <Loader /> :
                    profileId.length ?
                    <section
                        className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-10'
                    >
                        <div className='flex flex-col max-md:items-center gap-2 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[50px] md:py-10'>
                            <img 
                                src={profile_img} 
                                alt={fullname}
                                className='h-48 w-48 bg-grey rounded-full md:w-32 md:h-32'
                            />
                            <h1>@{profileId}</h1>
                            <p className='capitalize text-2xl font-medium'>{fullname}</p>
                            <p>{total_posts.toLocaleString()} Articles, {total_reads.toLocaleString()} Reads</p>

                            {
                                (loggedInUser == username) && 
                                <div className='flex gap-4 mt-4'>
                                    <Link 
                                        to='/settings/edit-profile'
                                        className='btn-light rounded-full'
                                        >
                                    Edit Profile</Link>
                                </div>
                            }

                            <AboutUser className='max-md:hidden' bio={bio} social_links={social_links} joinedAt={joinedAt} />
                        </div>

                        <div className='max-md:mt-12 w-full'>
                            <InPageNavigation 
                                routes={[`${fullname}'s articles`, 'about']} 
                                defaultHidden={['about']}
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
                                            fetchUserBlogs
                                        }
                                    />
                                </>

                                <>
                                    <AboutUser className='' bio={bio} social_links={social_links} joinedAt={joinedAt} /> 
                                </>
                            </InPageNavigation>
                        </div>
                        
                    </section>
                    : <PageNotFound />
                }
        </AnimationWrapper>
    )
}

export default Profile

