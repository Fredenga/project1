export interface Movie {
    $id?: string;
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    poster_url?: string ;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
