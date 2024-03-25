'use client'

import React, { FC, useState } from "react"
import Header from './components/Header/Header'
import Hero from "./components/Hero/Hero";

interface Props { }

const Page: FC<Props> = (props) => {
  // State for header component
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
      />
      <Hero/>
    </div>
  )
}

export default Page;