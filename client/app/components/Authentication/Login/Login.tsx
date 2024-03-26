// Login.jsx

'use client'
import React, { FC, useState } from 'react'
import './Login.css' // Import CSS file for styling
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { FaEnvelope } from 'react-icons/fa';
import { FaLock } from "react-icons/fa";
import Link from 'next/link'

type Props = {
    setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6),
})

const Login: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState(false);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            console.log(email, password)
        }
    })

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='flex justify-center items-center'>
            <div className='login'>
                <p className='login-title'>
                    Log in to your Account
                </p>
                <p className='login-description'>
                    Welcome back! Select method to log in:
                </p>
                <div className='login-method'>
                    <div className='login-method1 dark:border-white'>
                        <FcGoogle />
                        <p>Google</p>
                    </div>
                    <div className='login-method1 dark:border-white'>
                        <AiFillGithub />
                        <p>Github</p>
                    </div>
                </div>
                <div className='login-other-option'>
                    <div className='login-horizontal-line' />
                    <div>
                        <p style={{ color: "#8C94A3", fontFamily: "Poppins, sans-serif", fontSize: '12px' }}>or continue with email</p>
                    </div>
                    <div className='login-horizontal-line' />
                </div>

                <form onSubmit={handleSubmit} >
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
                                className={`email-field ${errors.email && touched.email ? "border-red-500" : ""}`}
                            />
                        </div>
                        <div>
                            {errors.email && touched.email && (
                                <span className='error-text'>{errors.email}</span> // Error message displayed below input
                            )}
                        </div>
                    </div>

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
                                className={`password-field ${errors.password && touched.password ? "border-red-500" : ""}`}
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
                        {errors.password && touched.password && (
                            <span className='error-text'>{errors.password}</span> // Error message displayed below input
                        )}
                    </div>

                    <div className='remember-forget'>
                        <div className="remember-me-checkbox">
                            <label htmlFor="rememberMe">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={checked}
                                    onChange={() => {
                                        setChecked(!checked)
                                    }}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text text-[#8C94A3]">Remember me</span>
                            </label>
                        </div>
                        <div className='forget-password'>
                            <Link href={'/'}>Forget Password?</Link>
                        </div>
                    </div>

                    <div className='login-button'>
                        <button type="submit" className='login-button-text text-black dark:text-white'>Log in</button>
                    </div>
                </form>

                <div className='create-account'>
                    <p className='create-account-text'>Don't have an account? &nbsp; <span className='text-[#FF6636] cursor-pointer' onClick={() => setRoute("Signup")}>Create an account</span></p>
                </div>

            </div>
        </div>
    )
}

export default Login
