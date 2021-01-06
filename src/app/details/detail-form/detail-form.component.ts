import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService, Ticket, User } from 'src/app/backend.service';

@Component({
    selector: 'app-detail-form',
    templateUrl: './detail-form.component.html',
    styleUrls: ['./detail-form.component.scss'],
})
export class DetailFormComponent implements OnInit {
    public form: FormGroup;
    @Input() ticket: Ticket;
    @Input() users: User[];
    constructor(private route: ActivatedRoute, private backend: BackendService, private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            id: [this.ticket.id],
            description: [this.ticket.description],
            assigneeId: [this.ticket.assigneeId],
            completed: [this.ticket.completed],
        });
    }
    saveButtonClick() {
        this.backend.updateTicket(this.form.value);
    }
}
