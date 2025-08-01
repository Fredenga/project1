import Search from "./components/Search.tsx";
import {useEffect, useState} from "react";
import Spinner from "./components/Spinner.tsx";
import MovieCard from "./components/MovieCard.tsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.ts";
import type {Movie} from "./Movie.ts";

const API_BASE_URL = "https://api.themoviedb.org/3"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [movieList, setMovieList] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm])

    const fetchMovies = async (query = "") => {
        setIsLoading(true)
        setErrorMessage('')
        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
            const response = await fetch(endpoint, API_OPTIONS)
            if(!response.ok) {
                throw new Error("Failed to fetch movies")
            }

            const data = await response.json()
            if(data.Response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies')
                setMovieList([])
                return;
            }
            setMovieList(data.results || [])
            console.log(movieList)
            if(query && data.results.length > 0){
                await updateSearchCount(query, data.results[0])
            }
        } catch (error) {
            console.error(`Fetching movies error: ${error}`)
            setErrorMessage("Error fetching movies, please try again later")
        } finally {
            setIsLoading(false)
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies()
            
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const fetchMovies = movies.map((movie): Movie => {
                return {
                    adult: movie.adult,
                    backdrop_path: movie.backdrop_path,
                    genre_ids: movie.genre_ids,
                    id: movie.id,
                    original_language: movie.original_language,
                    original_title: movie.original_title,
                    overview: movie.overview,
                    popularity: movie.popularity,
                    poster_path: movie.poster_path,
                    poster_url: movie.poster_path,
                    release_date: movie.release_date,
                    title: movie.title,
                    video: movie.video,
                    vote_average: movie.vote_average,
                    vote_count: movie.vote_count,
                };
            });
            setTrendingMovies(fetchMovies)
        } catch (e) {
            console.error(`Fetching trending movies error: ${e}`)
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm)

    }, [debouncedSearchTerm])

    useEffect(() => {
        loadTrendingMovies()
    }, []);
    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                    <h1>
                        Find <span className="text-gradient">Movies</span>
                         you'll enjoy without a hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {
                    trendingMovies.length > 0 && (
                        <section className="trending">
                            <h2>Trending Movies</h2>
                            <ul>
                                {
                                    trendingMovies.map((movie, index) => (
                                        <li key={movie.$id}>
                                            <p>{index + 1}</p>
                                            <img src={movie.poster_url} alt={movie.title} />
                                        </li>
                                    ))
                                }
                            </ul>
                        </section>
                    )
                }
                <section>
                    <h2>All Movies</h2>
                    {isLoading ? (
                        <Spinner/>
                    ): errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ): (
                        <ul>
                            {movieList.map((movie: Movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;