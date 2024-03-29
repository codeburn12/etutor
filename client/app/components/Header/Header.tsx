'use client'
import React, { FC, useState, useEffect } from 'react'
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
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useSocialAuthMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

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
    const { user } = useSelector((state: any) => state.auth);
    const { data } = useSession();
    const [socialAuth, { isSuccess, isError, error, }] = useSocialAuthMutation();

    useEffect(() => {
        if (!user) {
            if (data) {
                socialAuth({ email: data?.user?.email, name: data?.user?.name, avatar: data?.user?.image })
            }
        }
        if (isSuccess) {
            const message = "Login Successfully";
            toast.success(message);
        }
    }, [data, user]);

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

    const handleSignIn = (e: any) => {
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
                                                        <div>
                                                            <AiOutlineClose
                                                                size={25}
                                                                className='dark:text-white'
                                                                onClick={handleClose}
                                                                id='screen'
                                                            />
                                                        </div>
                                                        {
                                                            user ? (
                                                                <div className='flex items-center'>
                                                                    <Link href={"/profile"}>
                                                                        <img
                                                                            src={user.avatar ? user.avatar : "https://res.cloudinary.com/dc0gfvucc/image/upload/v1711539263/etutor-frontend/Unknown_person_pv153i.jpg"}
                                                                            alt=""
                                                                            height="30px"
                                                                            width="30px"
                                                                            className="rounded-full cursor-pointer"
                                                                        />
                                                                    </Link>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <HiOutlineUserCircle
                                                                        size={25}
                                                                        className='block 800px:block cursor-pointer dark:text-white text-black'
                                                                        onClick={handleSignIn}
                                                                        id='screen'
                                                                    />
                                                                </div>
                                                            )
                                                        }
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

                            {
                                user ? (
                                    <Link href={"/profile"}>
                                        <img
                                            src={user.avatar ? user.avatar : "https://res.cloudinary.com/dc0gfvucc/image/upload/v1711539263/etutor-frontend/Unknown_person_pv153i.jpg"}
                                            alt=""
                                            height="30px"
                                            width="30px"
                                            className="rounded-full cursor-pointer"
                                        />
                                    </Link>
                                ) : (
                                    <div>
                                        <HiOutlineUserCircle
                                            size={25}
                                            className='hidden 800px:block cursor-pointer dark:text-white text-black'
                                            onClick={handleSignIn}
                                            id='screen'
                                        />
                                    </div>
                                )
                            }

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
        </div >
    )
}

export default Header