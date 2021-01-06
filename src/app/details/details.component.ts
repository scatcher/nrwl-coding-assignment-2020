import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { BackendService, Ticket, User } from '../backend.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    ticket$: Observable<Ticket>;
    users$: Observable<User[]>;
    constructor(private route: ActivatedRoute, private backend: BackendService) {}

    ngOnInit() {
        const ticketId = this.route.snapshot.paramMap.get('id');
        this.ticket$ = this.backend.ticket(+ticketId).pipe(
            tap((ticket) => console.log(ticket)),
            filter((ticket) => !!ticket)
        );
        this.users$ = this.backend.users().pipe(
            map((users) => {
                return Object.entries(users).map(([key, user]) => user);
            }),
            first()
        );
    }
}
