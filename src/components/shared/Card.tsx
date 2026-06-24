
type TStats = {
    label?: string;
    value?: string;
    color?: string;
}

type TProps = {
    children?: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    stats?: TStats[];
    actions?: React.ReactNode;
}


const Card = ({ children, className, title, subtitle, stats, actions }: TProps) => {
    return (
        <section className={`${className} p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg w-full h-full`}>
            <div className="flex justify-between items-center mb-4">
                <div>
                    {
                        title && <h3 className="text-sm md:text-base text-white tracking-tight">{title}</h3>
                    }
                    {
                        subtitle && <p className="text-subheading text-xs">{subtitle}</p>
                    }
                </div>
                <div>
                    {
                        stats && <div className="flex items-center gap-3">
                            {
                                stats.map((item: TStats, index: number) =>(
                                    <div key={index} className="flex items-center gap-1">
                                        <div className={`size-2.5 rounded-full ${item?.color}`}></div>
                                        <p className="text-white text-xs">{item?.label}</p>
                                    </div>
                                ))
                            }
                        </div>
                    }
                    {
                        actions && <div>{actions}</div>
                    }
                </div>
            </div>
            <main>
                {children}
            </main>
        </section>
    )
}

export default Card