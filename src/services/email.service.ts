import { ClientResponse } from '@sendgrid/client/src/response';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sendgrid = require('@sendgrid/mail');

// if (process.env.NODE_ENV === EEnv.PROD) {
//     sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);
// }

export interface EmailTemplate {
    from: string;
    to: string;
    subject: string;
    body: string;
}

const sendEmail = (template: EmailTemplate): Promise<[ClientResponse, {}]> => {
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
