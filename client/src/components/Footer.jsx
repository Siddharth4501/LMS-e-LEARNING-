import React from 'react'
import {BsFacebook, BsTwitterX,BsInstagram,BsLinkedin} from 'react-icons/bs'
const Footer = () => {
    
    const currDate=new Date();
    const year=currDate.getFullYear();
  return (
    <>
        <footer className='relative left-0 bottom-0 min-h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 sm:px-20'>
            <section className='text-lg'>
                Copyright {year} | All rights reserved
            </section>
            <section className="flex items-center md:pt-0 pt-5 justify-center gap-3 text-2xl text-white">
                <a className='hover:text-blue-700 hover:bg-indigo-50 transition-all ease-in-out direction-300' href="">
                    <BsFacebook />
                </a>
                <a className='hover:text-black hover:bg-indigo-50 transition-all ease-in-out direction-300' href="">
                    <BsTwitterX/>
                </a>
                <a className='hover:text-sky-800 hover:bg-indigo-50 transition-all ease-in-out direction-300' href="">
                    <BsLinkedin/>
                </a>
                <a className='hover:text-fuchsia-800 transition-all ease-in-out direction-300' href="">
                    <BsInstagram/>
                </a>
            </section>
        </footer>
    </>
  )
}

export default Footer