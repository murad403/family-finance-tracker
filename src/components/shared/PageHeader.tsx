

type TProps = {
    title: string;
    description: string;
}

const PageHeader = ({ title, description }: TProps) => {
    return (
        <div>
            <h1 className="text-2xl font-black text-heading tracking-tight">{title}</h1>
            <p className="text-subheading text-sm">{description}</p>
        </div>
    )
}

export default PageHeader