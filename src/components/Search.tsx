import type {FC} from "react";

const Search: FC<SearchProps> = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <img src="search.svg" alt="search" />

            <input
                type="text"
                placeholder="Search through thousands of movies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

interface SearchProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

export default Search;