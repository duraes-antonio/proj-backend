import sendgrid from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';

export interface EmailTemplate {
    from: string;
    to: string;
    subject: string;
    body: string;
}

const sendEmail = (template: EmailTemplate): Promise<[ClientResponse, {}]> => {
    // sendgrid.setApiKey(config.sendgridApiKey);
    return sendgrid.send({
        from: template.from,
        to: template.to,
        subject: template.subject,
        html: template.body
    });
};

export const emailService = {
    sendEmail
};
