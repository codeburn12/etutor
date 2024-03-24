'use client'
import React, { FC, useState } from 'react'
import './Header.css'
import Link from 'next/link';
import NavItems from '@/app/utils/NavItems/NavItems';
import ThemeSwitcher from '@/app/utils/ThemeSwitcher/ThemeSwitcher';
import { HiMenu, HiOutlineUserCircle } from 'react-icons/hi';
import { AiOutlineClose } from "react-icons/ai";
import Image from 'next/image';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
}

const Header: FC<Props> = ({ activeItem, setOpen }) => {
    // State for Header active or inactive
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    // If scrollY > 80 then header become active
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                setActive(true);
            }
            else {
                setActive(false);
            }
        })
    }

    const handleClose = (e: any) => {
        if (e.target.id === 'screen') {
            setOpenSidebar(false);
        }
    }

    return (
        <div className='header'>
            <div className={`${active ? 'container_active' : 'container_inactive'}`}>
                <div className='subcontainer'>
                    <div className='header_items'>
                        {/* Logo */}
                        <div className='max-[800px]:hidden'>
                            <Link href={'/'} className='logo'>ETUTOR</Link>
                        </div>

                        <div className='800px:hidden'>
                            <Link href="/">
                                <img src="https://res.cloudinary.com/dc0gfvucc/image/upload/v1711298065/etutor-frontend/logo_etutor_spkun5.png" alt="Logo" height={50} width={50} />
                            </Link>
                        </div>

                        {/* Navbar Items, Theme Switcher */}
                        <div className='navitems'>
                            <NavItems
                                activeItems={activeItem}
                                isMobile={false}
                            />

                            {/* Mobile View */}
                            {
                                openSidebar ? (
                                    <>
                                        <div
                                            className='sidebar dark:bg-[unset]'
                                            onClick={handleClose}
                                            id='screen'
                                        >
                                            <div className='sidebar_content dark:bg-slate-900 dark:bg-opacity-90'>
                                                <div>
                                                    <div className='mobile_auth'>
                                                        <div className='flex items-center'>
                                                            <Link href={'/'} className='text-slate-600 dark:text-white'>Sign In</Link>
                                                            <div className='vertical_line dark:text-white'></div>
                                                            <Link href={'/'} className='text-slate-600 dark:text-white'>Register</Link>
                                                        </div>
                                                        <div>
                                                            <AiOutlineClose
                                                                size={25}
                                                                className='dark:text-white'
                                                                onClick={handleClose}
                                                                id='screen'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='horizontal_line'></div>
                                                    <NavItems activeItems={activeItem} isMobile={true} />
                                                </div>

                                                <div className='flex content-between justify-between'>
                                                    <div className='button justify-end border border-[#000] dark:border-[#fff]'>
                                                        <Link href={'/'} className='button_text'>Sign Out</Link>
                                                    </div>
                                                    <ThemeSwitcher />
                                                </div>

                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ThemeSwitcher />
                                        <div className='800px:hidden'>
                                            <HiMenu
                                                size={25}
                                                className='cursor-pointer dark:text-white text-black'
                                                onClick={() => setOpenSidebar(true)}
                                            />
                                        </div>
                                    </>
                                )
                            }

                            <div>
                                <HiOutlineUserCircle
                                    size={25}
                                    className='hidden 800px:block cursor-pointer dark:text-white text-black'
                                    onClick={() => setOpen(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Header