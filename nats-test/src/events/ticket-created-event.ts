import { Subjects } from './subjects'

export interface TicketCreatedEvent {
    subject: Subject.TicketsCreated;
    data: {
	id: string;
	title: string;
	price: number;
    };
}
