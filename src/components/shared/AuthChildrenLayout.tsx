import React from "react"

type TProps = {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

const AuthChildrenLayout = ({children, title, subtitle}: TProps) => {
  return (
    <section>
        <div>

        </div>

        
        <main>
            {children}
        </main>
    </section>
  )
}

export default AuthChildrenLayout