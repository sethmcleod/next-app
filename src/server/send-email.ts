import { info } from 'next/dist/build/output/log';
import { Client } from 'postmark';

const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL;
const API_TOKEN = process.env.POSTMARK_API_TOKEN || 'fake';

const client = new Client(API_TOKEN);

interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
}

/**
 * Send an email with Postmark
 *
 * @example
 * ```ts
 * sendEmail({
 *   to: user.email,
 *   subject: `Welcome to ${appName}!`,
 *   text: `We're happy to have you...`
 * })
 * ```
 */
export const sendEmail = (input: SendEmailInput) => {
  if (process.env.NODE_ENV === 'development') {
    info(`You've got mail!`);
    console.log();
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log();
    console.log(input.text);
    console.log();
    return;
  }

  if (!API_TOKEN || API_TOKEN === 'fake') {
    console.error('Please provide a POSTMARK_API_TOKEN environment variable.');
    return;
  }

  if (!FROM_EMAIL) {
    console.error('Please provide a POSTMARK_FROM_EMAIL environment variable.');
    return;
  }

  return client.sendEmail({
    From: FROM_EMAIL,
    To: input.to,
    Subject: input.subject,
    TextBody: input.text,
  });
};
