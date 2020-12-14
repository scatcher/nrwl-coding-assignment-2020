import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { MainListComponent } from './main-list/main-list.component';

const routes: Routes = [
    { path: '', component: MainListComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
