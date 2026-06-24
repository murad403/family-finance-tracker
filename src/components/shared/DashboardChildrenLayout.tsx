import React from "react"

type TProps = {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
}


const DashboardChildrenLayout = ({ children, title, subtitle, className }: TProps) => {
    return (
        <section className={`space-y-4 ${className}`}>
            <div>
                {
                    title && <h2 className="text-2xl font-black text-heading tracking-tight">{title}</h2>
                }
                {
                    subtitle && <p className="text-subheading text-sm">{subtitle}</p>
                }
            </div>

            <main className="space-y-4">
                {children}
            </main>
        </section>
    )
}

export default DashboardChildrenLayout