import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListComponent } from './list/list.component';
import { SingleComponent } from './single/single.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BannerComponent } from './banner/banner.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { GistListComponent } from './gist-list/gist-list.component';
import { GistEditComponent } from './gist-edit/gist-edit.component';
import { UserService } from './user.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CookieService } from 'ngx-cookie-service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RenderComponent } from './render/render.component';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ScriptEditComponent } from './script-edit/script-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    SingleComponent,
    HeaderComponent,
    BannerComponent,
    GistListComponent,
    GistEditComponent,
    RegisterComponent,
    LoginComponent,
    RenderComponent,
    ForgotPasswordComponent,
    ScriptEditComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MarkdownModule.forRoot(),
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    MonacoEditorModule.forRoot(),
    SimpleNotificationsModule.forRoot({
      //position: ["top", "right"],
    }),
    ToastrModule.forRoot(),
  ],
  providers: [CookieService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
