import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule } from '@angular/forms';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InerceptorService } from './Services/inerceptor.service';
import { AuthenticationService } from './Services/authentication.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { ImprintComponent } from './imprint/imprint.component';
import { MatButtonModule } from '@angular/material/button';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from './Dialogs/delete-account-dialog/delete-account-dialog.component';
import { UserVideosComponent } from './user-videos/user-videos.component';
import { VideoUploadDialogComponent } from './Dialogs/video-upload-dialog/video-upload-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserVideoDetailComponent } from './user-video-detail/user-video-detail.component';
import { EditUservideoDialogComponent } from './Dialogs/edit-uservideo-dialog/edit-uservideo-dialog.component';
import { DeleteUservideoDialogComponent } from './Dialogs/delete-uservideo-dialog/delete-uservideo-dialog.component';
import { HamburgerMenuComponent } from './hamburger-menu/hamburger-menu.component';
import { EditUserDialogComponent } from './Dialogs/edit-user-dialog/edit-user-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    SignUpComponent,
    LogInComponent,
    EmailConfirmedComponent,
    ResetPasswordComponent,
    SetNewPasswordComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    ImageSliderComponent,
    WatchlistComponent,
    MovieDetailComponent,
    LegalNoticeComponent,
    ImprintComponent,
    SidenavComponent,
    DeleteAccountDialogComponent,
    UserVideosComponent,
    VideoUploadDialogComponent,
    UserVideoDetailComponent,
    EditUservideoDialogComponent,
    DeleteUservideoDialogComponent,
    HamburgerMenuComponent,
    EditUserDialogComponent
  ],
  imports: [
    MatProgressBarModule,
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InerceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
