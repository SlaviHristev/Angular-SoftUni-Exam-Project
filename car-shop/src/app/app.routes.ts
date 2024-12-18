import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CreateComponent } from './pages/create/create.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { SinglePageComponent } from './pages/single-page/single-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';
import { EditComponent } from './pages/edit-page/edit-page.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'create', component: CreateComponent, canActivate:[AuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
    {path: 'profiles/:id', component: UserProfileComponent},
    {path: 'profile/update', component: ProfileUpdateComponent,canActivate:[AuthGuard]},
    {path: 'edit/:id', component: EditComponent, canActivate:[AuthGuard]},
    {path: 'catalog', children:[
        {path:'', component:CatalogComponent},
        {path:':id', component: SinglePageComponent},
    ]},
    {path: '**', component: NotFoundComponent}
];
