import { Component, OnInit } from '@angular/core';
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


  logo_url: string = ''
  movie_array: any = []
  similar_movies: any = []

  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
    public auth: AuthenticationService
  ) { }


  closeMovieDetail() {
    this.content.open_movie_detail = false
    this.youtube.destroyPlayer()
    this.similar_movies = []
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };


  async playYouTubeVideo() {
    let movie_id = this.content.movie_detail.id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player2', await this.content.getTrailer(movie_id));
    });
    this.content.loading = false
  }


  getLogoUrl() {
    let logos = this.content.movie_detail.images.logos
    let en_logos: any[] = []
    logos.forEach((logo: any) => {
      if (logo.iso_639_1 == 'en') en_logos.push(logo)
    });
    this.logo_url = this.content.imageBase_url + en_logos[0].file_path
  }


  async updateWatchList(movie: { object: any, in_watchlist: boolean, id: string }) {
    if (movie.in_watchlist) this.removeFromWatchlist(movie.id)
    else this.addToWatchlist(movie)
  }


  async addToWatchlist(movie: any) {
    this.content.movie_detail.in_watchlist = true
    this.content.watchlist.push(movie)
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
    this.setWatchlistStatus()
  }


  async removeFromWatchlist(movie_id: string) {
    this.content.movie_detail.in_watchlist = false
    let watchlist_movie_ids = this.content.watchlist.map(item => item.id)
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


  getRuntime() {
    let hours = Math.floor(this.content.movie_detail.runtime / 60);
    let minutes = this.content.movie_detail.runtime % 60;
    return `${hours} hrs ${minutes} min`
  }


  async getSimilarMoviesDetails() {
    let similar_movies = this.content.movie_detail.similar.results
    similar_movies.forEach(async (movie: any) => {
      let similar_movie = await this.content.getMovieDetails(movie.id)
      if (similar_movie.images.logos.length > 0) {
        let en_logos: any[] = []
        similar_movie.images.logos.forEach((logo: any) => {
          if (logo.iso_639_1 == 'en') en_logos.push(logo)
        });
        if(en_logos.length > 0) similar_movie.en_logo = en_logos[0].file_path
      }
      if (similar_movie.backdrop_path && similar_movie.en_logo) this.similar_movies.push(similar_movie)
    });
  }
}
