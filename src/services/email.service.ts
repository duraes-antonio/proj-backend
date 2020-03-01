// @ts-ignore
import sendgrid from '@sendgrid/mail';
import { config } from '../config';
import { ClientResponse } from '@sendgrid/client/src/response';

export interface IEmailTemplate {
    from: string,
    to: string,
    subject: string,
    body: string
}

export function sendEmail(template: IEmailTemplate): Promise<[ClientResponse, {}]> {
    sendgrid.setApiKey(config.sendgridApiKey);
    return sendgrid.send({
        from: template.from,
        to: template.to,
        subject: template.subject,
        html: template.body
    });
}
