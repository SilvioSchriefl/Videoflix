import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../content.service';
import { YouTubePlayerService } from '../you-tube-player.service';
import { AuthenticationService } from '../authentication.service';


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
  recommend_video: boolean = false


  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
    public auth: AuthenticationService
  ) { }


  closeMovieDetail() {
    this.content.open_movie_detail = false
    this.youtube.destroyPlayer()
    this.recommendations_movies = []
    this.content.movie_detail = []
  }


  async playBackgroundYouTubeVideo() {
    let player = this.player.nativeElement.ViewChild
    let movie_id = this.content.movie_detail.id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player2', await this.content.getTrailer(movie_id));
    });
  }


  async playYouTubeVideo() {
    this.content.play = true
    let movie_id = this.content.movie_detail.id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie_id));
    });
    this.content.loading = false
  }


  playRecommendYouTubeVideo( movie: { id: string; }) {
    this.recommend_video = true
    this.youtube.destroyPlayer()
    this.content.play = true
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie.id));
    });
  }


  async getLogoUrl() {
    let logos = this.content.movie_detail.images.logos
    let en_logos: any[] = []
    logos.forEach((logo: any) => {
      if (logo.iso_639_1 == 'en') en_logos.push(logo)
    });
    if(en_logos.length > 0) this.logo_url = this.content.imageBase_url + en_logos[0].file_path
    else this.logo_url = 'noLogo'
  }


  async updateWatchList(movie: { object: any, in_watchlist: boolean, id: string }) {
    if (movie.in_watchlist) {
      this.content.movie_detail.in_watchlist = false
      this.removeFromWatchlist(movie.id)
    } 
    else {
      this.content.movie_detail.in_watchlist = true
      this.addToWatchlist(movie)
    } 
  }


  async addToWatchlist(movie: any) { 
    this.content.watchlist.push(movie)
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
    this.setWatchlistStatus()
  }


  async removeFromWatchlist(movie_id: string) {
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


  setWatchlistStatus() {
    this.content.checkIfMovieIsInWatchList(this.content.trending_movies)
    this.content.checkIfMovieIsInWatchList(this.content.popular_movies)
    this.content.checkIfMovieIsInWatchList(this.content.action_movies)
    this.content.checkIfMovieIsInWatchList(this.content.animation_movies)
    this.content.checkIfMovieIsInWatchList(this.content.adventure_movies)
    this.content.checkIfMovieIsInWatchList(this.content.science_fiction_movies)
  }


  getToolTipText(in_watchlist: boolean) {
    if (in_watchlist) return 'Remove from Watchlist'
    else return 'Add to Watchlist'
  }


  getProductionYear() {
    let date = new Date(this.content.movie_detail.release_date)
    return date.getFullYear()
  }


  getProductionYearRecommendMovie(release_date:string) {
    let date = new Date(release_date)
    return date.getFullYear()
  }


  getRuntime() {
    let hours = Math.floor(this.content.movie_detail.runtime / 60);
    let minutes = this.content.movie_detail.runtime % 60;
    return `${hours} hrs ${minutes} min`
  }


  async getRecommendationMoviesDetails() {
    let recommendation_movies = this.content.movie_detail.recommendations.results
    recommendation_movies.forEach(async (movie: any) => {
      let recommendation_movie = await this.content.getMovieDetails(movie.id)
      if (recommendation_movie.images.logos.length > 0) {
        let en_logos: any[] = []
        recommendation_movie.images.logos.forEach((logo: any) => {
          if (logo.iso_639_1 == 'en') en_logos.push(logo)
        });
        if(en_logos.length > 0) recommendation_movie.en_logo = en_logos[0].file_path
      }
      if (recommendation_movie.backdrop_path && recommendation_movie.en_logo) {
        this.checkWhetherMovieInWatchlist(recommendation_movie)
        this.recommendations_movies.push(recommendation_movie)
      } 
    });
  }


  checkWhetherMovieInWatchlist(movie:any) {
    let watchlist_movie_ids = this.content.watchlist.map((item: { id: number; }) => item.id)
    if (watchlist_movie_ids.includes(movie.id)) movie.in_watchlist = true
      else movie.in_watchlist = false
  }


  setMovieWatchlistStatus(movie: { in_watchlist: boolean, id: string } ) {
    if (movie.in_watchlist) {
      movie.in_watchlist = false
      this.removeFromWatchlist(movie.id)
    } 
    else {
      movie.in_watchlist = true
      this.addToWatchlist(movie)
    } 
  }


  toggleMuteTone() {
    if (this.tone_muted) {
      this.tone_muted = false
      this.youtube.unMuteVideoTone()} 
    else {
      this.tone_muted = true
      this.youtube.muteVideoTone()
    } 
  }


  showPLayButton(i: number) {
    this.hover_index = i
    this.show_play_button = true
  }


  hidePlayButton() {
    this.show_play_button = false
  }
}
