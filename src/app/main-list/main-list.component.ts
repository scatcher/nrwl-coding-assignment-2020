import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith, tap, first } from 'rxjs/operators';
import { BackendService, Ticket, User } from '../backend.service';

interface UserTicket extends Ticket {
    userName: string;
}

@Component({
    selector: 'app-main-list',
    templateUrl: './main-list.component.html',
    styleUrls: ['./main-list.component.scss'],
})
export class MainListComponent implements OnInit {
    public form: FormGroup;
    public loading$ = new BehaviorSubject<boolean>(true);
    public tickets$: Observable<UserTicket[]>;
    public users$: Observable<User[]>;
    public displayNewItemControl = false;
    public users: User[] = [];

    constructor(private backend: BackendService, private fb: FormBuilder) {}
    ngOnInit() {
        this.form = this.fb.group({
            filterText: [''],
            newItemText: [''],
        });
        const filterChanges$ = this.form.get('filterText').valueChanges.pipe(startWith(''), debounceTime(300));
        this.backend
            .users()
            .pipe(
                map((users) => {
                    return Object.entries(users).map(([key, user]) => user);
                }),
                first()
            )
            .subscribe((users) => (this.users = users));

        this.tickets$ = combineLatest([this.backend.tickets(), this.backend.users(), filterChanges$]).pipe(
            map(([tickets, users, filterText]) => {
                return Object.entries(tickets)
                    .map(([id, ticket]) => {
                        const userName = users[ticket.assigneeId]?.name;
                        return { ...ticket, userName: userName };
                    })
                    .filter((ticket) => this.checkFieldsForValue(ticket, filterText));
            }),
            tap((tickets) => this.loading$.next(false))
        );
    }
    public toggleComplete(ticket: UserTicket) {
        this.loading$.next(true);
        this.backend.complete(ticket.id, !ticket.completed).subscribe();
    }
    public saveNewTicket() {
        this.loading$.next(true);
        this.backend.newTicket({ description: this.form.get('newItemText').value }).subscribe(() => {
            this.displayNewItemControl = false;
            this.form.get('newItemText').setValue('');
        });
    }
    public updateUser(ticket: UserTicket, userId: string) {
        this.loading$.next(true);
        this.backend.assign(ticket.id, +userId).subscribe();
    }
    private checkFieldsForValue(ticket: UserTicket, filterValue: string) {
        return ['description', 'userName'].some((field) => {
            return !!ticket[field] && this.cleanString(ticket[field]).includes(this.cleanString(filterValue));
        });
    }
    // Remove spaces and special characters
    private cleanString(str: string) {
        return str.toLowerCase().replace(/[^A-Z0-9]+/gi, '');
    }
}
