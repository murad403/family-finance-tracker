import Image from 'next/image'
import logo from "@/assets/logo/logo3.png";


const AuthBrand = () => {
    return (
        <div className="flex flex-col items-center text-center">

            <Image width={300} height={200} src={logo} alt='logo' />
            <p className="mb-4 text-sm md:text-base text-slate-300">
                Private financial system for your family
            </p>
        </div>
    )
}

export default AuthBrand