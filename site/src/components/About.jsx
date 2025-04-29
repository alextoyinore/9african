import React from 'react'
import { Link } from 'react-router-dom'
import { getFullDay } from '../common/date'


const AboutUser = ({ className, bio, social_links, joinedAt }) => {
    let  { youtube, instagram, facebook, twitter, github, website } = social_links

    return (
        <div className={'md:w-[90%] md:mt-5 ' + className}>
            <p className={'leading-7 ' + (!bio.length ? 'text-dark-grey' : null)}>
                {bio.length ? bio : 'Bio not available'}
            </p>
            
            <div className='text-dark-grey flex gap-x-5 gap-y-3 flex-wrap my-7 items-center'>
                {
                    Object.keys(social_links).map((key) => {
                        let link = social_links[key]

                        return link.length ?
                        <Link className='btn-light flex gap-2 items-center justify-center' target='_blank' to={link}>
                            <i className={'fi ' + (key != 'website' ? 'fi-brands-' + key : 'fi-rr-globe') + 'text-2xl hover:text-black'}></i>
                        </Link> : null
                    })
                }

                <div className='max-md:hidden'>Joined: {getFullDay(joinedAt) }</div>
            </div>
        </div>
    )
}

export default AboutUser

