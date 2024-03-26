'use client'
import React, { FC, useState } from 'react'
import './Signup.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { FaEnvelope } from 'react-icons/fa';
import { BsFillPersonFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import Link from 'next/link'

type Props = {
    setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().email("Invalid email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6),
})

const Signup: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);

    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }) => {
            setRoute("Verification")
        }
    })

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='flex justify-center items-center'>
            <div className='signup'>
                <p className='signup-title'>
                    Sign Up
                </p>
                <p className='signup-description'>
                    New Here! Select method to Sign up:
                </p>
                <div className='signup-method'>
                    <div className='signup-method1 dark:border-white'>
                        <FcGoogle />
                        <p>Google</p>
                    </div>
                    <div className='signup-method1 dark:border-white'>
                        <AiFillGithub />
                        <p>Github</p>
                    </div>
                </div>
                <div className='signup-other-option'>
                    <div className='signup-horizontal-line' />
                    <div>
                        <p className='signup-horizontal-line-text'>or</p>
                    </div>
                    <div className='signup-horizontal-line' />
                </div>

                <form onSubmit={handleSubmit} >
                    {/* Name */}
                    <div>
                        <div className='name-input'>
                            <BsFillPersonFill className="name-icon" />
                            <input
                                type='text'
                                name='name' // Added name attribute for Formik
                                value={values.name}
                                onChange={handleChange}
                                id='text'
                                placeholder='Name'
                                className={`name-field ${errors.name && touched.name ? "border-red-500" : ""}`} // Added className for error handling
                            />

                        </div>
                        <div>
                            {errors.name && touched.name && (
                                <span className='error-text'>{errors.name}</span>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <div className='email-input'>
                            <FaEnvelope className="email-icon" />
                            <input
                                type='email'
                                name='email' // Added name attribute for Formik
                                value={values.email}
                                onChange={handleChange}
                                id='email'
                                placeholder='Email'
                                className={`email-field ${errors.email && touched.email ? "border-red-500" : ""}`} // Added className for error handling
                            />

                        </div>
                        <div>
                            {errors.email && touched.email && (
                                <span className='error-text'>{errors.email}</span>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className='password-input'>
                            <FaLock className="password-icon" />
                            <input
                                type={!show ? "password" : "text"}
                                name='password' // Added name attribute for Formik
                                value={values.password}
                                onChange={handleChange}
                                id='password'
                                placeholder='Password'
                                className={`password-field ${errors.password && touched.password ? "border-red-500" : ""}`} // Added className for error handling
                            />
                            {!show ? (
                                <AiOutlineEyeInvisible
                                    className='relative right-2 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(true)}
                                />
                            ) : (
                                <AiOutlineEye
                                    className='relative right-2 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(false)}
                                />
                            )}

                        </div>
                        <div>
                            {errors.password && touched.password && (
                                <span className='error-text'>{errors.password}</span>
                            )}
                        </div>
                    </div>

                    <div className='signup-button'>
                        <button type="submit" className='signup-button-text text-black dark:text-white'>Sign Up</button>
                    </div>
                </form>

                <div className='create-account'>
                    <p className='create-account-text'>Already have an account? &nbsp; <span className='text-[#FF6636] cursor-pointer' onClick={() => setRoute("Login")}>Sign in</span></p>
                </div>

            </div>
        </div>
    )
}

export default Signup