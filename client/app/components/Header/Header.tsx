'use client'
import React, { FC, useState } from 'react'
import './Header.css'

type Props = {
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
            <div className='container'>

            </div>
        </div>
    )
}

export default Header