import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { JobViewComponent } from './pages/job-view/job-view.component';
import { JobsPageComponent } from './pages/jobs-page/jobs-page.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PolicyComponent } from './pages/policy/policy.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'job/:id', component: JobViewComponent },
    { path: 'jobs/:type', component: JobsPageComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    {path: 'terms',component:TermsComponent},
    {path:'policy',component:PolicyComponent}
];
