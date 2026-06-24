import React from 'react'
import logo from "@/assets/logo/logo3.png";
import Image from 'next/image';


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='bg-slate-700 min-h-screen flex flex-col justify-center items-center p-6 sm:p-4 md:p-0'>
            <div className='flex justify-center items-center flex-col text-center'>
                <Image width={300} height={200} src={logo} alt='logo' className='select-none' />
                <p className="mb-4 text-sm md:text-base text-slate-300">
                    Private financial system for your family
                </p>
            </div>
            <div className='max-w-lg w-full'>
                {children}
            </div>
        </main>
    )
}

export default layout