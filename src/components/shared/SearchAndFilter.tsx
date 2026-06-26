import { Search } from 'lucide-react';
import { Input } from '../ui/input';

type Tprops = {
    className?: string;
    search?: boolean;
    searchPlaceholder?: string;
    filters?: boolean;
}

const SearchAndFilter = ({ className, search, searchPlaceholder, filters }: Tprops) => {
    return (
        <div className={`${className} p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg w-full flex justify-between items-center`}>
            {/* search */}
            <div className='w-full'>
                {
                    search && <div className="relative max-w-xl h-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-label" />
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                        />
                    </div>
                }
            </div>

            {/* filter */}
            <div>

            </div>
        </div>
    )
}

export default SearchAndFilter