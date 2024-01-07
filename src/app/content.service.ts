import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MovieDetail } from './Interfaces/movie-detail.interface';
import { Results } from './Interfaces/movie-detail.interface';
import { Genre_ids } from './Interfaces/genre_ids.interface';



@Injectable({
  providedIn: 'root'
})

export class ContentService {


  genres = {
    url: ['&with_genres=12', '&with_genres=28', '&with_genres=16', '&with_genres=35', '&with_genres=878', '&with_genres=10752', '&with_genres=53'],
    genre: ['adventure', 'action', 'animation', 'comedy', 'Science Fiction', 'War', 'Thriller']
  }
  thumbnails = []
  preview_video_url: string = ''
  loading: boolean = false
  video_loaded: boolean = false
  fullsize_video_url: string = ''
  api_key: string = 'f8a561c979166c581310857e10b126f6'
  imageBase_url: string = 'https://image.tmdb.org/t/p/w500'
  imageSlider_url: string = 'https://image.tmdb.org/t/p/original'
  trending_movies = []
  popular_movies: MovieDetail[] = []
  action_movies = []
  war_movies = []
  thriller_movies = []
  search_results: any = []
  comedy_movies = []
  animation_movies = []
  adventure_movies = []
  science_fiction_movies = []
  popular_movies_details: MovieDetail[] = []
  play: boolean = false
  watchlist: any = []
  movie_detail: any = []
  isFunctionComplete = false;
  open_movie_detail: boolean = false
  scroll_top: boolean = true
  tooltip_text: string = ''
  open_search_results: boolean = false
  all_movies: any = []
  search_text: string = '';
  open_sidebar: boolean = false;
  searching: boolean = false;
  genre_ids: Genre_ids[] = [
    { name: 'Action', id: 28 },
    { name: 'Adventure', id: 12 },
    { name: 'Animation', id: 16 },
    { name: 'Comedy', id: 35 },
    { name: 'Crime', id: 80 },
    { name: 'Documentary', id: 99 },
    { name: 'Drama', id: 18 },
    { name: 'Family', id: 10751 },
    { name: 'Fantasy', id: 14 },
    { name: 'History', id: 36 },
    { name: 'Horror', id: 27 },
    { name: 'Music', id: 10402 },
    { name: 'Mystery', id: 9648 },
    { name: 'Romance', id: 10749 },
    { name: 'Science Fiction', id: 878 },
    { name: 'TV Movie', id: 10770 },
    { name: 'Thriller', id: 53 },
    { name: 'War', id: 10752 },
    { name: 'Western', id: 37 },
  ];


  constructor(
    private http: HttpClient,
  ) { }


  /**
   * Retrieves the thumbnails from the server.
   *
   * @return {Promise<void>} Returns a promise that resolves when the thumbnails are retrieved.
   */
  async getThumbnails(): Promise<void> {
    let url = environment.baseUrl + '/thumbnail/'
    try {
      let response: any = await lastValueFrom(this.http.get(url));
      this.thumbnails = response

    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves the 480p video for a given ID.
   *
   * @param {number} id - The ID of the video.
   * @return {Promise<void>} - A Promise that resolves when the video is retrieved.
   */
  async getVideo480p(id: number): Promise<void> {
    let url = environment.baseUrl + '/video_preview/' + id + '/'
    try {
      let response: any = await lastValueFrom(this.http.get(url))
      this.preview_video_url = response.video_url
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves a video by its ID and updates the fullsize_video_url property.
   *
   * @param {number} id - The ID of the video.
   * @return {Promise<void>} - A Promise that resolves when the video is retrieved and the fullsize_video_url property is updated.
   */
  async getVideo(id: number) {
    let url = environment.baseUrl + '/video/' + id + '/'
    try {
      let response: any = await lastValueFrom(this.http.get(url))
      this.fullsize_video_url = response.video_url
    }
    catch (error) {
      console.log(error);
    }
  }

  /**
   * Retrieves the trending movies from the API.
   *
   * @returns {Promise<void>} - Resolves when the trending movies are successfully retrieved.
   */
  async getTrendingMovies(): Promise<void> {
    let url = "https://api.themoviedb.org/3/trending/movie/week?page=1&api_key=" + this.api_key
    try {
      let response: any = await lastValueFrom(this.http.get(url))
      await this.checkIfMovieIsInWatchList(response.results)
      this.trending_movies = response.results
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves the popular movies from the API.
   *
   * @returns {Promise<void>} - A promise that resolves when the popular movies are retrieved.
   */
  async getPopularMovies(): Promise<void> {
    let url = "https://api.themoviedb.org/3/movie/popular?api_key=" + this.api_key
    try {
      let response = await lastValueFrom(this.http.get<Results>(url))
      this.popular_movies = response.results
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves movies by genres.
   *
   * @async
   * @return {Promise<void>} - Promise that resolves when the function completes.
   */
  async getMovieByGenres(): Promise<void> {
    for (let i = 0; i < this.genres.url.length; i++) {
      let genre_url = this.genres.url[i];
      let url = environment.genre_url + this.api_key + genre_url
      try {
        let response = await lastValueFrom(this.http.get<Results>(url))
        this.fillArray(this.genres.genre[i], response.results)
      }
      catch (error) {
        console.log(error);
      }
    }
  }


  /**
   * Fills the array for the specified genre with the given response.
   *
   * @param {string} genre - The genre of the movies.
   * @param {any} response - The response containing the movies.
   */
  fillArray(genre: string, response: any) {
    if (genre == 'action') this.action_movies = response
    if (genre == 'animation') this.animation_movies = response
    if (genre == 'adventure') this.adventure_movies = response
    if (genre == 'comedy') this.comedy_movies = response
    if (genre == 'Science Fiction') this.science_fiction_movies = response
    if (genre == 'War') this.war_movies = response
    if (genre == 'Thriller') this.thriller_movies = response
    this.all_movies = [...this.action_movies, ...this.animation_movies, ...this.adventure_movies, ...this.comedy_movies, ...this.science_fiction_movies, ...this.war_movies, ...this.thriller_movies]
  }


  /**
   * Retrieves movie details from the API.
   *
   * @param {string} id - The ID of the movie.
   * @return {Promise<any>} A Promise that resolves to the movie details.
   */
  async getMovieDetails(id: string): Promise<any> {
    let url = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + this.api_key + '&append_to_response=videos,images,similar,credits,recommendations'
    try {
      let response = await lastValueFrom(this.http.get(url))
      return response
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves the movie video based on the provided ID.
   *
   * @param {string} id - The ID of the movie.
   * @return {Promise<void>} - A Promise that resolves to nothing.
   */
  async getMovieVideo(id: string) {
    let url = 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + this.api_key
    try {
      let response = await lastValueFrom(this.http.get(url))
      console.log(response);
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves the movie details for each slide in the slide movie carousel.
   */
  async getSlideMovieDetails() {
    for (let i = 0; i < this.popular_movies.length; i++) {
      let movie: { id: string } = this.popular_movies[i];
      let movie_id = movie.id
      let url = 'https://api.themoviedb.org/3/movie/' + movie_id + '?api_key=' + this.api_key + '&append_to_response=videos,images'
      try {
        let response = await lastValueFrom(this.http.get<MovieDetail>(url))
        if (response.backdrop_path && response.images.logos.length > 0) this.popular_movies_details.push(response)
      }
      catch (error) {
        console.log(error);
      }
    }
  }


  /**
   * Retrieves the trailer for a movie.
   *
   * @param {string} movie_id - The ID of the movie.
   * @return {Promise<any>} A promise that resolves to the video ID of the trailer.
   */
  async getTrailer(movie_id: string): Promise<any> {
    let url = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${this.api_key}&name=Official%20Trailer`;
    try {
      let response: any = await lastValueFrom(this.http.get(url))
      return this.setVideoId(response.results)
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Sets the video ID based on the given trailers.
   *
   * @param {any[]} trailers - An array of trailers.
   * @return {string} - The video ID.
   */
  setVideoId(trailers: any): string {
    let video_id
    trailers.forEach((trailer: any) => {
      if (trailer.name == 'Official Trailer') video_id = trailer.key
    });
    if (!video_id) video_id = trailers[0].key
    return video_id
  }


  /**
   * Update the watchlist with the given body for the specified user.
   *
   * @param {any} body - The data to be sent in the request body.
   * @param {string} user_id - The ID of the user.
   * @return {Promise<void>} A Promise that resolves when the watchlist is successfully updated.
   */
  async updateWatchList(body: any, user_id: string): Promise<void> {
    let url = environment.baseUrl + '/watchlist/' + user_id + '/'
    try {
      let response: any = await lastValueFrom(this.http.patch(url, body))
      this.watchlist = response.watchlist
      console.log(response);
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Retrieves the watchlist for a given user.
   *
   * @param {string} user_id - The ID of the user.
   * @return {Promise<void>} - A Promise that resolves when the watchlist is retrieved successfully.
   */
  async getWatchList(user_id: string): Promise<void> {
    let url = environment.baseUrl + '/watchlist/' + user_id + '/'
    try {
      let response: any = await lastValueFrom(this.http.get(url))
      this.watchlist = response.watchlist
    }
    catch (error) {
      console.log(error);
    }
  }


  /**
   * Checks if a movie is in the watchlist.
   *
   * @param {any[]} movies - The array of movies to check.
   */
  async checkIfMovieIsInWatchList(movies: any) {
    let watchlist_movie_ids = this.watchlist.map((item: { id: number; }) => item.id)
    movies.forEach((movie: any) => {
      if (watchlist_movie_ids.includes(movie.id)) movie.in_watchlist = true
      else movie.in_watchlist = false
    });
  }


  /**
   * Generates the tooltip text based on the watchlist status.
   *
   * @param {boolean} watchlist_status - The current watchlist status.
   */
  getToolTipText(watchlist_status: boolean) {
    if (watchlist_status) this.tooltip_text = 'Remove from Watchlist'
    else this.tooltip_text = 'Add to Watchlist'
  }


  /**
   * Retrieves the search results based on the current search text.
   * The search is case-insensitive.
   */
  getSearchResults() {
    let movie_search_results: any[] = []
    let titels = this.all_movies.map((movie: { title: string; }) => movie.title)
    let search_results = titels.filter((title: string) => title.toLowerCase().includes(this.search_text.toLowerCase()))
    this.all_movies.forEach((movie: any) => {
      if (search_results.includes(movie.title)) movie_search_results.push(movie)
    })
    this.search_results = this.removeDuplicates(movie_search_results)
    this.getGenreNames(this.search_results)
  }


  /**
   * Removes duplicates from an array of objects.
   *
   * @param {any[]} objects - The array of objects.
   * @return {any[]} The array with duplicates removed.
   */
  removeDuplicates(objects: any[]): any[] {
    const uniqueObjects = Array.from(new Set(objects.map(obj => JSON.stringify(obj))));
    return uniqueObjects.map(objString => JSON.parse(objString));
  }


  /**
   * Iterates over an array of movies and retrieves the corresponding genre names
   * based on the genre IDs. If a genre name is found for a given ID, it is added
   * to the movie object. If no genre name is found, the string 'Unknown Genre' is
   * added instead.
   *
   * @param {any[]} array - The array of movies to process.
   */
  getGenreNames(array: any) {
    array.forEach((movie: any) => {
      let genre_names: string[] = []
      genre_names = movie.genre_ids.map((id: number) => {
        let genre = this.genre_ids.find(genre => genre.id === id);
        return genre ? genre.name : 'Unknown Genre';
      });
      movie.genres = genre_names
    })
  }
}


