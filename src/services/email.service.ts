// @ts-ignore
import sendgrid from '@sendgrid/mail';
import { config } from '../config';

export interface IEmailTemplate {
	from: string,
	to: string,
	subject: string,
	body: string
}

export function sendEmail(template: IEmailTemplate): void {
	sendgrid.setApiKey(config.sendgridApiKey);
	sendgrid.send({
		from: template.from,
		to: template.to,
		subject: template.subject,
		html: template.body
	});
}
