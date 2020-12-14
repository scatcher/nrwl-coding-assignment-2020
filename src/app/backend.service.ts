import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { delay, first, map, tap } from 'rxjs/operators';

/**
 * This service acts as a mock back-end.
 * It has some intentional errors that you might have to fix.
 */

export interface User {
    id: number;
    name: string;
}

export interface Ticket {
    id: number;
    description: string;
    assigneeId: number;
    completed: boolean;
}

function randomDelay() {
    return Math.random() * 4000;
}

@Injectable()
export class BackendService {
    private storedTickets$ = new BehaviorSubject<{ [key: number]: Ticket }>({
        1: {
            id: 1,
            description: 'Install a monitor arm',
            assigneeId: 111,
            completed: false,
        },
        2: {
            id: 2,
            description: 'Move the desk to the new location',
            assigneeId: 112,
            completed: false,
        },
        3: {
            id: 3,
            description: 'Take out the trash',
            assigneeId: null,
            completed: false,
        },
    });

    private storedUsers$ = new BehaviorSubject<{ [key: number]: User }>({
        111: { id: 111, name: 'Victor' },
        112: { id: 112, name: 'Jack' },
        113: { id: 113, name: 'Scott' },
        114: { id: 114, name: 'Tiffany' },
    });

    private lastId = 3;

    constructor() {}

    private findTicketById = (id: number) =>
        this.storedTickets$.pipe(
            first(),
            map((tickets) => tickets[+id])
        );
    private findUserById = (id: number) =>
        this.storedUsers$.pipe(
            first(),
            map((users) => users[+id])
        );

    tickets() {
        return this.storedTickets$.pipe(delay(randomDelay()));
    }

    ticket(id: number): Observable<Ticket> {
        return this.findTicketById(id).pipe(delay(randomDelay()));
    }

    users() {
        return this.storedUsers$.pipe(delay(randomDelay()));
    }

    user(id: number) {
        return this.findUserById(id).pipe(delay(randomDelay()));
    }

    newTicket(payload: { description: string }) {
        const newTicket: Ticket = {
            id: ++this.lastId,
            description: payload.description,
            assigneeId: null,
            completed: false,
        };
        this.tickets()
            .pipe(first())
            .subscribe((tickets) => {
                const updatedTickets = { ...tickets, [newTicket.id]: newTicket };
                this.storedTickets$.next(updatedTickets);
            });

        return this.tickets();
    }

    assign(ticketId: number, userId: number) {
        return combineLatest([this.tickets(), this.users()]).pipe(
            first(),
            map(([tickets, users]) => {
                if (tickets[ticketId] && users[userId]) {
                    const updatedTicket = { ...tickets[ticketId], assigneeId: userId };
                    const updatedTickets = { ...tickets, [ticketId]: updatedTicket };
                    this.storedTickets$.next(updatedTickets);
                    return updatedTickets;
                } else {
                    return throwError(new Error('ticket or user not found'));
                }
            })
        );
    }

    complete(ticketId: number, completed: boolean) {
        return this.tickets().pipe(
            first(),
            map((tickets) => {
                if (tickets[ticketId]) {
                    const updatedTicket = { ...tickets[ticketId], completed: completed };
                    const updatedTickets = { ...tickets, [ticketId]: updatedTicket };
                    this.storedTickets$.next(updatedTickets);
                    return updatedTickets;
                } else {
                    return throwError(new Error('ticket not found'));
                }
            })
        );
    }
}
