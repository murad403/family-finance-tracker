type TProps = {
    title?: string;
    description?: string;
}

const CardHeader = ({ title, description }: TProps) => {
    return (
        <div>
            <h1 className="text-sm md:text-base text-white tracking-tight">{title}</h1>
            <p className="text-subheading text-xs">{description}</p>
        </div>
    )
}

export default CardHeader;