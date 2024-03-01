import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { YouTubePlayerService } from '../Services/you-tube-player.service';
import { AuthenticationService } from '../Services/authentication.service';


declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.sass']
})
export class MovieDetailComponent {


  @ViewChild('player') player!: ElementRef;
  logo_url: string = ''
  movie_array: any = []
  recommendations_movies: any = []
  tone_muted: boolean = false
  show_play_button: boolean = false
  hover_index: number = 0
  play_video_from_detail: boolean = false



  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
    public auth: AuthenticationService
  ) { }


  /**
   * Closes the movie detail view and destroys the player.
   */
  closeMovieDetail() {
    this.content.open_movie_detail = false
    this.youtube.destroyPlayer()
    this.recommendations_movies = []
    this.content.movie_detail = []
  }


  /**
   * Plays a YouTube video in the background.
   *
   * @return {Promise<void>} - A promise that resolves when the video starts playing.
   */
  async playBackgroundYouTubeVideo(): Promise<void> {
    let movie_id = this.content.movie_detail.id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player2', await this.content.getTrailer(movie_id));
    });
  }


  /**
   * Plays a YouTube video.
   */
  async playYouTubeVideo() {
    this.play_video_from_detail = true
    this.youtube.destroyPlayer()
    this.content.play = true
    let movie_id = this.content.movie_detail.id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie_id));
    });
    this.content.loading = false
  }


  /**
   * Plays the recommended YouTube video.
   *
   * @param {object} movie - The movie object containing the ID of the video.
   */
  playRecommendYouTubeVideo(movie: { id: string; }) {
    this.play_video_from_detail = true
    this.youtube.destroyPlayer()
    this.content.play = true
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie.id));
    });
  }


  /**
   * Retrieves the URL of the logo.
   */
  getLogoUrl() {
    let logos = this.content.movie_detail.images.logos
    let en_logos: any[] = []
    logos.forEach((logo: any) => {
      if (logo.iso_639_1 == 'en') en_logos.push(logo)
    });
    if (en_logos.length > 0) this.logo_url = this.content.imageBase_url + en_logos[0].file_path
    else this.logo_url = 'noLogo'
  }


  /**
   * Updates the watchlist status of a movie.
   *
   * @param {object} movie - The movie object.
   * @param {boolean} movie.in_watchlist - The current watchlist status of the movie.
   * @param {string} movie.id - The ID of the movie.
   */
  updateWatchList(movie: { object: any, in_watchlist: boolean, id: string }) {
    if (movie.in_watchlist) {
      this.content.movie_detail.in_watchlist = false
      this.removeFromWatchlist(movie.id)
    }
    else {
      this.content.movie_detail.in_watchlist = true
      this.addToWatchlist(movie)
    }
  }


  /**
   * Adds a movie to the watchlist.
   *
   * @param {any} movie - The movie to add to the watchlist.
   * @return {Promise<void>} - A promise that resolves when the movie is successfully added to the watchlist.
   */
  async addToWatchlist(movie: any): Promise<void> {
    this.content.watchlist.push(movie)
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
    this.setWatchlistStatus()
  }


  /**
   * Removes a movie from the watchlist.
   *
   * @param {string} movie_id - The ID of the movie to be removed.
   * @return {Promise<void>} - A Promise that resolves when the movie is removed from the watchlist.
   */
  async removeFromWatchlist(movie_id: string): Promise<void> {
    let watchlist_movie_ids = this.content.watchlist.map((item: { id: any; }) => item.id)
    let i = watchlist_movie_ids.indexOf(movie_id)
    this.content.watchlist.splice(i, 1)
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
    this.setWatchlistStatus()
  }


  /**
   * Set the watchlist status for all movies in the content.
   *
   * This function checks if each movie in the content is in the user's watchlist and updates the watchlist status accordingly.
   */
  setWatchlistStatus() {
    this.content.checkIfMovieIsInWatchList(this.content.trending_movies)
    this.content.checkIfMovieIsInWatchList(this.content.popular_movies)
    this.content.checkIfMovieIsInWatchList(this.content.action_movies)
    this.content.checkIfMovieIsInWatchList(this.content.animation_movies)
    this.content.checkIfMovieIsInWatchList(this.content.adventure_movies)
    this.content.checkIfMovieIsInWatchList(this.content.science_fiction_movies)
  }



  /**
   * Returns the tooltip text based on the value of 'in_watchlist'.
   *
   * @param {boolean} in_watchlist - Indicates whether the item is in the watchlist.
   * @return {string} The tooltip text.
   */
  getToolTipText(in_watchlist: boolean): string {
      if (in_watchlist) return 'Remove from Watchlist'
      else return 'Add to Watchlist'
  }


 
  /**
   * Get the production year of the movie.
   *
   * @return {number} the production year of the movie, or 0 if the movie detail is not available
   */
  getProductionYear(): number {
    if(this.content.movie_detail) {
    let date = new Date(this.content.movie_detail.release_date)
    return date.getFullYear()
    }
    else return 0
  }


  /**
   * Calculates the production year of a recommended movie based on the given release date.
   *
   * @param {string} release_date - The release date of the movie in the format "YYYY-MM-DD".
   * @return {number} The production year of the recommended movie.
   */
  getProductionYearRecommendMovie(release_date: string): number {
    let date = new Date(release_date)
    return date.getFullYear()
  }


  /**
   * Calculate the total runtime of a movie in hours and minutes.
   *
   * @return {string} the total runtime formatted as "X hrs Y min"
   */
  getRuntime(): string | undefined {
    if(!this.content.movie_detail) return
    let hours = Math.floor(this.content.movie_detail.runtime / 60);
    let minutes = this.content.movie_detail.runtime % 60;
    return `${hours} hrs ${minutes} min`
  }


  /**
   * Retrieves details of recommended movies and adds them to the recommendations_movies array.
   */
  async getRecommendationMoviesDetails() {
    let recommendation_movies = this.content.movie_detail.recommendations.results
    recommendation_movies.forEach(async (movie: any) => {
      let recommendation_movie = await this.content.getMovieDetails(movie.id)
      if (recommendation_movie.images.logos.length > 0) {
        let en_logos: any[] = []
        recommendation_movie.images.logos.forEach((logo: any) => {
          if (logo.iso_639_1 == 'en') en_logos.push(logo)
        });
        if (en_logos.length > 0) recommendation_movie.en_logo = en_logos[0].file_path
      }
      if (recommendation_movie.backdrop_path && recommendation_movie.en_logo) {
        this.checkWhetherMovieInWatchlist(recommendation_movie)
        this.recommendations_movies.push(recommendation_movie)
      }
    });
  }


  /**
   * Checks whether a movie is in the watchlist.
   *
   * @param {any} movie - The movie object to check.
   */
  checkWhetherMovieInWatchlist(movie: any) {
    let watchlist_movie_ids = this.content.watchlist.map((item: { id: number; }) => item.id)
    if (watchlist_movie_ids.includes(movie.id)) movie.in_watchlist = true
    else movie.in_watchlist = false
  }


  /**
   * Toggles the watchlist status of a movie.
   *
   * @param {Object} movie - The movie object.
   * @param {boolean} movie.in_watchlist - The current watchlist status of the movie.
   * @param {string} movie.id - The ID of the movie.
   */
  setMovieWatchlistStatus(movie: { in_watchlist: boolean; id: string; genres: { name: string; }[]; }) {
    if (movie.in_watchlist) {
      movie.in_watchlist = false
      this.removeFromWatchlist(movie.id)
    }
    else {
      movie.in_watchlist = true
      this.addGenreNames(movie)
      this.addToWatchlist(movie)
    }
  }


  /**
   * Adds genre names to the movie object.
   *
   * @param {{ in_watchlist: boolean; id: string; genres: { name: string; }[]; }} movie - the movie object
   */
  addGenreNames(movie: { in_watchlist: boolean; id: string; genres: { name: string; }[]; }) {
    let genres: any = movie.genres.map(genre => genre.name)
    movie.genres = genres
  }


  /**
   * Toggle the mute state for the tone.
   */
  toggleMuteTone() {
    if (this.tone_muted) {
      this.tone_muted = false
      this.youtube.unMuteVideoTone()
    }
    else {
      this.tone_muted = true
      this.youtube.muteVideoTone()
    }
  }


  /**
   * Shows the play button for the specified index.
   *
   * @param {number} i - The index of the element.
   */
  showPLayButton(i: number) {
    this.hover_index = i
    this.show_play_button = true
  }


  /**
   * Hides the play button.
   */
  hidePlayButton() {
    this.show_play_button = false
  }
}
