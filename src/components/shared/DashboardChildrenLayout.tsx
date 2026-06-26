import React from "react"

type TProps = {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    actions?: React.ReactNode;
}


const DashboardChildrenLayout = ({ children, title, subtitle, className, actions }: TProps) => {
    return (
        <section className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-center">
                <div>
                    {
                        title && <h2 className="text-2xl font-black text-heading tracking-tight">{title}</h2>
                    }
                    {
                        subtitle && <p className="text-subheading text-sm">{subtitle}</p>
                    }
                </div>
                <div>
                    {
                        actions && actions
                    }
                </div>
            </div>

            <main className="space-y-4">
                {children}
            </main>
        </section>
    )
}

export default DashboardChildrenLayout