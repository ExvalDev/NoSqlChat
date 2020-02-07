import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './landing-page/login/login.component';
import { RegisterComponent } from './landing-page/register/register.component';
import { ProfileComponent } from './main-page/_components/profile/profile.component';
import { TimelineComponent } from './main-page/_components/timeline/timeline.component';
import { MainfeedComponent } from './main-page/_components/mainfeed/mainfeed.component';
import { PersonalPostsComponent } from './main-page/_components/personal-posts/personal-posts.component';
import { PostComponent } from './main-page/_components/post/post.component';
import { PostFormComponent } from './main-page/_components/post-form/post-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    MainPageComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    TimelineComponent,
    MainfeedComponent,
    PersonalPostsComponent,
    PostComponent,
    PostFormComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
