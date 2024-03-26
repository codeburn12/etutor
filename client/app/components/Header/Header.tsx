'use client'
import React, { FC, useState } from 'react'
import './Header.css'
import Link from 'next/link';
import NavItems from '@/app/utils/NavItems/NavItems';
import ThemeSwitcher from '@/app/utils/ThemeSwitcher/ThemeSwitcher';
import { HiMenu, HiOutlineUserCircle } from 'react-icons/hi';
import { AiOutlineClose } from "react-icons/ai";
import Image from 'next/image';
import Login from '../Authentication/Login/Login';
import Signup from '../Authentication/Signup/Signup';
import CustomModal from '../../utils/CustomModal/CustomModal';
import Verification from '../Authentication/Verification/Verification';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string) => void;
    component: (props: any) => JSX.Element;
}

const Header: FC<Props> = ({ open, setOpen, activeItem, route, setRoute, component }) => {
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

    const handleSignIn = (e:any) => {
        handleClose(e);
        setOpen(true);
    }

    return (
        <div className='header'>
            <div className={`${active ? 'container_active dark:bg-black' : 'container_inactive'}`}>
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
                                                            <Link onClick={handleSignIn} id='screen' href={'/'} className='text-slate-600 dark:text-white'>Log in</Link>
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

            {
                route === "Login" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setOpen={setOpen}
                                    activeItem={activeItem}
                                    setRoute={setRoute}
                                    route={route}
                                    component={Login}
                                />
                            )
                        }
                    </>
                )
            }

            {
                route === "Signup" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setOpen={setOpen}
                                    activeItem={activeItem}
                                    setRoute={setRoute}
                                    route={route}
                                    component={Signup}
                                />
                            )
                        }
                    </>
                )
            }

            {
                route === "Verification" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setOpen={setOpen}
                                    activeItem={activeItem}
                                    setRoute={setRoute}
                                    route={route}
                                    component={Verification}
                                />
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

export default Header