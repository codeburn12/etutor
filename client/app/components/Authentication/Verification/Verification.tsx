import React, { FC, useRef, useState } from 'react'
import './verification.css'
import { Toast } from 'react-hot-toast'
import { VscWorkspaceTrusted } from 'react-icons/vsc';


type Props = {
  setRoute: (route: string) => void;
}

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
}

const Verification: FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    setInvalidError(true)
  }

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    setVerifyNumber(newVerifyNumber); // Update the state with the new value
  }

  return (
    <div>
      <p className='verification-title'>
        Verify your account
      </p>
      <p className='verification-description'>
        We have sent you an OTP to your email
      </p>
      <div className='authenticator'>
        <div className='authenticator-icon'>
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>

      <div className='otp'>
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type='number'
            name='number'
            key={key}
            ref={inputRefs[index]}
            placeholder=''
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className={`${invalidError ? "shake border-red-500" : "dark:border-white border-[#0000004a]"} dark:text-white text-black otp-verify`}
          />
        ))}
      </div>

      <div className='verify-button'>
        <button onClick={verificationHandler} type="submit" className='verify-button-text text-black dark:text-white'>Sign Up</button>
      </div>

      <div className='create-account'>
        <p className='create-account-text'>Go back to Sign in &nbsp; <span className='text-[#FF6636] cursor-pointer' onClick={() => setRoute("Login")}>Sign in</span></p>
      </div>

    </div>
  )
}

export default Verification
