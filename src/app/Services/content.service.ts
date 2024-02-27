import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { Observable, Subscription, finalize, lastValueFrom } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Genre_ids } from '../Interfaces/genre_ids.interface';
import { VideoResponse } from '../Interfaces/VideoResponse.interface';
import { Watchlist } from '../Interfaces/watchlist.interface';
import { Movies } from '../Interfaces/movie.interface';
import { UserVideo } from '../Interfaces/user_video.interface';



@Injectable({
  providedIn: 'root'
})

export class ContentService {


  genres = {
    url: ['&with_genres=12', '&with_genres=28', '&with_genres=16', '&with_genres=35', '&with_genres=878', '&with_genres=10752', '&with_genres=53'],
    genre: ['adventure', 'action', 'animation', 'comedy', 'Science Fiction', 'War', 'Thriller']
  }
  guest: boolean = false
  preview_video_url: string = ''
  loading: boolean = false
  video_loaded: boolean = false
  fullsize_video_url: string = ''
  api_key: string = 'f8a561c979166c581310857e10b126f6'
  imageBase_url: string = 'https://image.tmdb.org/t/p/w500'
  imageSlider_url: string = 'https://image.tmdb.org/t/p/original'
  trending_movies = []
  popular_movies: Movies[] = []
  action_movies = []
  war_movies = []
  thriller_movies = []
  search_results: any = []
  comedy_movies = []
  animation_movies = []
  adventure_movies = []
  science_fiction_movies = []
  popular_movies_details: Movies[] = []
  play: boolean = false
  watchlist: any = []
  movie_detail: any = []
  isFunctionComplete = false;
  open_movie_detail: boolean = false
  open_user_video: boolean = false
  scroll_top: boolean = true
  tooltip_text: string = ''
  open_search_results: boolean = false
  all_movies = []
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
  uploadSub: Subscription | null = null;
  progress: number = 0;
  upload_complete: boolean = false;
  upload_error: boolean = false;
  user_videos: UserVideo[] = []
  user_video_detail!: UserVideo
  uploading: boolean = false
  menu_active = false;



  constructor(
    private http: HttpClient,
  ) { }


  /**
   * Retrieves a video by its ID and updates the fullsize_video_url property.
   *
   * @param {number} id - The ID of the video.
   * @return {Promise<void>} - A Promise that resolves when the video is retrieved and the fullsize_video_url property is updated.
   */
  async getVideo(id: number): Promise<void> {
    let url = environment.baseUrl + '/video/' + id + '/'
    try {
      let response = await lastValueFrom(this.http.get<VideoResponse>(url))
      this.fullsize_video_url = response.video_url
    }
    catch (error) {
      console.error;
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
      let response = await lastValueFrom(this.http.get<Movies>(url))
      await this.checkIfMovieIsInWatchList(response.results)
      this.getGenreNames(response.results)
      this.trending_movies = response.results
    }
    catch (error) {
      console.error;
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
      let response = await lastValueFrom(this.http.get<Movies>(url))
      this.getGenreNames(response.results)
      this.popular_movies = response.results
    }
    catch (error) {
      console.error;
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
        let response = await lastValueFrom(this.http.get<Movies>(url))
        this.getGenreNames(response.results)
        this.fillArray(this.genres.genre[i], response.results)
      }
      catch (error) {
        console.error;
      }
    }
  }


  /**
   * Fill the array based on the genre.
   *
   * @param {string} genre - the genre of the movies
   * @param {never[]} response - the response array
   */
  fillArray(genre: string, response: never[]) {
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
      console.error;
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
      console.error;
    }
  }


  /**
   * Retrieves the movie details for each slide in the slide movie carousel.
   */
  async getSlideMovieDetails() {
    for (let i = 0; i < this.popular_movies.length; i++) {
      let movie: { id: string } = this.popular_movies[i];
      let movie_id = movie.id
      let url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${this.api_key}&append_to_response=videos,images`
      try {
        let response = await lastValueFrom(this.http.get<Movies>(url))
        if (response.backdrop_path && response.images.logos.length > 0) this.popular_movies_details.push(response)
      }
      catch (error) {
        console.error;
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
      let response = await lastValueFrom(this.http.get<Movies>(url))
      return this.setVideoId(response.results)
    }
    catch (error) {
      console.error;
    }
  }



  /**
   * Sets the video ID based on the given trailers.
   *
   * @param {Array} trailers - The list of trailers.
   * @return {string} The video ID.
   */
  setVideoId(trailers: any): string {
    let video_id
    trailers.forEach((trailer: { name: string; key: string; }) => {
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
      let response = await lastValueFrom(this.http.patch<Watchlist>(url, body))
      this.watchlist = response.watchlist
    }
    catch (error) {
      console.error;
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
      let response = await lastValueFrom(this.http.get<Watchlist>(url))
      this.watchlist = response.watchlist
    }
    catch (error) {
      console.error;
    }
  }


  /**
   * Checks if a movie is in the watchlist.
   *
   * @param {any[]} movies - The array of movies to check.
   */
  async checkIfMovieIsInWatchList(movies: any[]) {
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
    if (!watchlist_status) this.tooltip_text = 'Add to Watchlist'
    if (this.guest) this.tooltip_text = 'Not available for the guest'
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
   * Updates the genre names in the given array of movies based on the genre IDs.
   *
   * @param {Array<{ genre_ids: number[]; genres: string[]; }>} array - The array of movies.
   */
  async getGenreNames(array: { genre_ids: number[]; genres: string[]; }[]) {
    array.forEach((movie: { genre_ids: number[]; genres: string[]; }) => {
      let genre_names: string[] = []
      genre_names = movie.genre_ids.map((id: number) => {
        let genre = this.genre_ids.find(genre => genre.id === id);
        return genre ? genre.name : 'Unknown Genre';
      });
      movie.genres = genre_names
    })
  }


  uploadVideo(formData: FormData) {
    this.uploading = true
    let url = environment.baseUrl + '/video/';
    const upload$ = this.http.post<UserVideo>(url, formData, {
      reportProgress: true,
      observe: 'events'
    })
    this.uploadSub = upload$.subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total !== undefined) {
            this.progress = Math.round(100 * (event.loaded / event.total));
          }
        }
      },
      error: (error: any) => {
        this.handleUploadError(error)
      },
      complete: () => {
        setTimeout(() => {
          this.upload_complete = true
          this.uploading = false
        }, 1000);
        this.getUserVideos()
        console.log(this.user_videos);
      }
    });
  }


  handleUploadError(error: any) {
    console.log(error);
    this.upload_error = true
    setTimeout(() => {
      this.upload_complete = true
      this.uploading = false
    }, 1000);
  }


  cancelUpload() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
    this.reset();
  }


  reset() {
    this.progress = 0;
    this.uploadSub = null;
  }


  async getUserVideos() {
    let url = environment.baseUrl + '/video/'
    try {
      this.user_videos = await lastValueFrom(this.http.get<UserVideo[]>(url))
      console.log(this.user_videos);
    }
    catch (error) {
      console.error;
    }
  }


  async deleteVideo() {
    let url = environment.baseUrl + '/video/' + this.user_video_detail.id + '/';
    try {
      await lastValueFrom(this.http.delete(url ));
      await this.getUserVideos()
      return true
    }
    catch (error) {
      console.log(error); 
      console.error;
      return false
    }
  }


  async editVideo(body: { id: number; title: string; description: string; }) {
    let url = environment.baseUrl + '/video/'
    try {
      let response = await lastValueFrom(this.http.patch<UserVideo>(url, body))
      this.updateUserVideo(response)  
      return true
    }
    catch (error) {
      console.error;
      return false
    }
  }


  updateUserVideo(edited_video: UserVideo) {
    let video = this.user_videos.find(video => video.id === edited_video.id )
    if(!video) return
    video.title = edited_video.title
    video.description = edited_video.description
    this.user_video_detail = video
  }
}


