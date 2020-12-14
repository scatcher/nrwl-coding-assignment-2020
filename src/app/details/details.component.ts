import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService, Ticket } from '../backend.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    ticket$: Observable<Ticket>;
    constructor(private route: ActivatedRoute, private backend: BackendService) {}

    ngOnInit() {
        const ticketId = this.route.snapshot.paramMap.get('id');
        this.ticket$ = this.backend.ticket(+ticketId);
    }
}
