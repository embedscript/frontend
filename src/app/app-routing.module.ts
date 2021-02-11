import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GistListComponent } from './gist-list/gist-list.component';
import { GistEditComponent } from './gist-edit/gist-edit.component';
import { ListComponent } from './list/list.component';
import { SingleComponent } from './single/single.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'gists',
    component: GistListComponent,
  },
  {
    path: 'gist/:id',
    component: GistEditComponent,
  },
  {
    path: ':id',
    component: SingleComponent,
  },
  {
    path: '',
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
