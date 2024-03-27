import React, { FC, useRef, useState, useEffect } from 'react'
import './verification.css'
import { toast } from 'react-hot-toast'
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { useActivationMutation } from '@/redux/features/auth/authApi';

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
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      const message = "Acoount activated successfully";
      toast.success(message);
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        console.log('An error has occured')
      }
    }
  }, [isSuccess, error]);

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
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length != 4) {
      setInvalidError(true)
      return;
    }
    
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    })
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
