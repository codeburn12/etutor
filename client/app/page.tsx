'use client'

import React, { FC, useState } from "react"
import Header from './components/Header/Header'
import Hero from "./components/Hero/Hero";
import Login from "./components/Authentication/Login/Login";
import Heading from "./utils/Heading";

interface Props { }

const Page: FC<Props> = (props) => {
  // State for header component
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState('Login')
  return (
    <div>
      <Heading
        title={"ETutor"}
        description={"A learnig and teaching platform"}
        keywords={"Programming, MERN, Testing"}
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
        component={Login}
      />
      <Hero />
    </div>
  )
}

export default Page;