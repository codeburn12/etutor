import React, { FC } from "react";
import Link from "next/link";
import './NavItems.css'

export const navItemsData = [
    {
        name: "Home",
        url: "/",
    },
    {
        name: "Courses",
        urls: "/courses",
    },
    {
        name: "About",
        url: "/about",
    },
    {
        name: "Policy",
        url: "/policy",
    },
    {
        name: "FAQ",
        url: "/faq",
    }
]

type Props = {
    activeItems: number;
    isMobile: boolean;
}

const NavItems: FC<Props> = ({activeItems, isMobile}) => {
    return (
        <>
            <div className="navbar">
                {
                    navItemsData && navItemsData.map((item, index) => (
                        <Link href={`${item.url}`} key={index} passHref>
                            <span className={`${activeItems === index ? "navitem_active" : "navitem_inactive"} navitem`}>
                                {item.name}
                            </span>
                        </Link>
                    ))
                }
            </div>

            {
                isMobile && (
                    <div className="mobileview_navitem">
                        {
                            navItemsData && navItemsData.map((item, index) => (
                                <Link href="/" passHref>
                                    <span className={`${activeItems === index ? "navitem_active" : "navitem_inactive"} navitem mobileview_navitem_display`}>
                                        {item.name}
                                    </span>
                                </Link>
                            ))
                        }
                    </div>
                )
            }

        </>
    )
}

export default NavItems;