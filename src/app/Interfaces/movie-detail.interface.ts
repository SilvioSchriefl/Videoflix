export interface MovieDetail {
    id: string;
    overview: string;
    images: {
        logos: {file_path: string } []
    };
    backdrop_path: string;
}

export interface Results {
    results: []
}

export interface Watchlist {
    id: string;
}