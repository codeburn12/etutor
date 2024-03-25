import React, { FC } from 'react'
import './Hero.css'
import Image from 'next/image'
import Link from 'next/link'
import { BiSearch } from 'react-icons/bi'

type Props = {}

const Hero = (props: Props) => {
    return (
        <div className='hero'>

            <div className='hero_image'>
                <img src='https://res.cloudinary.com/dc0gfvucc/image/upload/v1711331832/etutor-frontend/heroImage_jdaqkz.jpg' alt='hero_image' height='100%' width='100%' />
            </div>

            <div className='hero_content'>
                <p className='hero_content1'>
                    Learn with expert anytime anywhere
                </p>
                <p className='hero_content2'>Our mision is to help people to find the best course online and learn with expert anytime, anywhere.</p>
                <div className='hero_content3'>
                    <div className=''>
                        <input type='search' id='course' name='course' placeholder='Search Courses' />
                    </div>
                    <div className=''>
                        <BiSearch className='search_icon' />
                    </div>
                </div>
                <div className='hero_content4'>
                    <img src='https://res.cloudinary.com/dc0gfvucc/image/upload/v1711348553/etutor-frontend/profile1_nxfh2h.jpg' />
                    <img src='https://res.cloudinary.com/dc0gfvucc/image/upload/v1711348552/etutor-frontend/profile2_eldfqo.jpg' />
                    <img src='https://res.cloudinary.com/dc0gfvucc/image/upload/v1711348552/etutor-frontend/profile3_tregfm.jpg' />
                    <p className='hero_content2'>
                        50k+ People already trusted Us.
                        <Link href={"/"} className='text-[#FF6636] max-[400px]:hidden'>&nbsp;View Courses</Link>
                        <Link href={"/"} className='text-[#FF6636] 400px:hidden hero_content2'>
                            <br />
                            View Courses
                        </Link>
                    </p>


                </div>

            </div>


        </div>
    )
}

export default Hero