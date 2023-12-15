import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  genres = {
    url: ['&with_genres=12', '&with_genres=28', '&with_genres=16'],
    genre: ['adventure', 'action', 'animation']
  }
  thumbnails: any = []
  preview_video_url: string = ''
  loading: boolean = false
  video_loaded: boolean = false
  fullsize_video_url: string = ''
  api_key: string = 'f8a561c979166c581310857e10b126f6'
  imageBase_url: string = 'https://image.tmdb.org/t/p/w500'
  imageSlider_url: string = 'https://image.tmdb.org/t/p/original'
  trending_movies: any = []
  action_movies: any = []
  animation_movies: any = []
  adventure_movies: any = []
  trending_movies_details: any = []


  constructor(
    private http: HttpClient,
  ) { }


  async getThumbnails() {
    let url = environment.baseUrl + '/thumbnail/'
    try {
      let response: any = await lastValueFrom(this.http.get(url));
      this.thumbnails = response

    }
    catch (error) {
      console.log(error);
    }
  }


  async getVideo480p(id: number) {
    let url = environment.baseUrl + '/video_preview/' + id + '/'
    try {
      let response: any = await lastValueFrom(this.http.get(url))
      this.preview_video_url = response.video_url
    }
    catch (error) {
      console.log(error);
    }
  }


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

  async getTrendingMovies() {
    let url = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + this.api_key
    try {
      let response: any = await lastValueFrom(this.http.get(url))
      console.log(response);
      this.trending_movies = response.results
    }
    catch (error) {
      console.log(error);
    }
  }

  async getMovieByGenres() {
    for (let i = 0; i < this.genres.url.length; i++) {
      let genre_url = this.genres.url[i];
      let url = environment.genre_url + this.api_key + genre_url
      try {
        let response: any = await lastValueFrom(this.http.get(url))
        this.fillArray(this.genres.genre[i], response.results)
      }
      catch (error) {
        console.log(error);
      }
    }
  }


  fillArray(genre: string, response: any) {
    if (genre == 'action') this.action_movies = response
    if (genre == 'animation') this.animation_movies = response
    if (genre == 'adventure') this.adventure_movies = response
  }


  async getMovieDetails(id: string) {
    let url = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + this.api_key
    try {
      let response = await lastValueFrom(this.http.get(url))
      console.log(response);

    }
    catch (error) {
      console.log(error);
    }
  }


  async getMovieVideo(id: string) {
    let url = 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + this.api_key
    try {
      let response = await lastValueFrom(this.http.get(url))
      console.log(response);
    }
    catch (error) {
      console.log(error);
      console.log(url);
    }
  }


  async getSlideMovieDetails() {
    for (let i = 0; i < this.trending_movies.length; i++) {
      let movie = this.trending_movies[i];
      let movie_id = movie.id
      let url = 'https://api.themoviedb.org/3/movie/' + movie_id + '?api_key=' + this.api_key + '&append_to_response=videos,images'
      try {
        let response = await lastValueFrom(this.http.get(url))
       this.trending_movies_details.push(response)
      }
      catch (error) {
        console.log(error);
      }
    }
    console.log(this.trending_movies_details[0]);
    
  }
}