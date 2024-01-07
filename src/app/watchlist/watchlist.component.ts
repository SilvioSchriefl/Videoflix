import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../content.service';
import { AuthenticationService } from '../authentication.service';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { YouTubePlayerService } from '../you-tube-player.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.sass']
})
export class WatchlistComponent {

  @ViewChild(MovieDetailComponent) movieDetail!: MovieDetailComponent



  constructor(
    public content: ContentService,
    public auth: AuthenticationService,
    public youtube: YouTubePlayerService
  ) { }


  /**
   * Opens the details of a movie.
   *
   * @param {any} data - The data for the movie. It can be either a number representing the index of the movie in the popular_movies_details array, or an object with an id property representing the id of the movie.
   * @return {Promise<void>} Returns a Promise that resolves to void.
   */
  async openMovieDetails(data: any): Promise<void> {
    let movie_id
    if (typeof data === 'number') movie_id = this.content.popular_movies_details[data].id
    else movie_id = data.id
    this.content.movie_detail = await this.content.getMovieDetails(movie_id)
    if (data.in_watchlist) this.content.movie_detail.in_watchlist = true
    this.content.open_movie_detail = true
    this.movieDetail.getLogoUrl()
    this.movieDetail.playBackgroundYouTubeVideo()
    await this.movieDetail.getRecommendationMoviesDetails()
  }


  /**
   * Closes the video by setting the `play` property of `this.content` to `false`
   * and destroying the YouTube player.
   */
  closeVideo() {
    this.content.play = false
    this.youtube.destroyPlayer()
  }
}
