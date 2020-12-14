import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { AppRoutingModule } from './app-routing.module';
import { MainListComponent } from './main-list/main-list.component';
import { DetailsComponent } from './details/details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [AppComponent, MainListComponent, DetailsComponent],
    imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
    providers: [BackendService],
    bootstrap: [AppComponent],
})
export class AppModule {}
