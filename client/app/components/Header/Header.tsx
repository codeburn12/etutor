'use client'
import React, { FC, useState } from 'react'
import './Header.css'

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
}

const Header: FC<Props> = (props) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

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

    return (
        <div className='header'>
            <div className={`${active ? 'container_active' : 'container_inactive'}`}>
                hi baby
            </div>
        </div>
    )
}

export default Header