import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { AuthenticationService } from '../Services/authentication.service';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { YouTubePlayerService } from '../Services/you-tube-player.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.sass']
})
export class WatchlistComponent implements OnInit {

  @ViewChild(MovieDetailComponent) movieDetail!: MovieDetailComponent



  constructor(
    public content: ContentService,
    public auth: AuthenticationService,
    public youtube: YouTubePlayerService
  ) { }


  ngOnInit(): void {
    this.content.scroll_top = true
  }


  /**
   * Opens the details of a movie.
   *
   * @param {any} data - The data for the movie. It can be either a number representing the index of the movie in the popular_movies_details array, or an object with an id property representing the id of the movie.
   * @return {Promise<void>} Returns a Promise that resolves to void.
   */
  async openMovieDetails(data: any): Promise<void> { 
    let movie_id
    if (typeof data === 'number') movie_id = this.content.popular_movies_details[data].id
    else movie_id = data.movie_id
    this.content.movie_detail = await this.content.getMovieDetails(movie_id)
    if (data.in_watchlist) this.content.movie_detail.in_watchlist = true
    this.content.open_movie_detail = true
    this.movieDetail.getLogoUrl()
    this.movieDetail.playBackgroundYouTubeVideo()
    await this.movieDetail.getRecommendationMoviesDetails()
  }


 
  /**
   * Closes the video by stopping playback, destroying the YouTube player, and optionally playing a background video.
   *
   * @return {Promise<void>} Promise that resolves when the video is closed.
   */
  async closeVideo(): Promise<void> {
    this.content.play = false
    this.youtube.destroyPlayer()
    if(this.movieDetail.play_video_from_detail) {
      this.movieDetail.play_video_from_detail = false
      await this.movieDetail.playBackgroundYouTubeVideo()
    }
  }
}
