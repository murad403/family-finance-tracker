import AuthBrand from '@/components/shared/AuthBrand'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='bg-black min-h-screen flex flex-col justify-center items-center'>
            <AuthBrand />
            <div className='max-w-lg w-full'>
                {children}
            </div>
        </main>
    )
}

export default layout