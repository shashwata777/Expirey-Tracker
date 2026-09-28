import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend SDK
// Note: onboarding@resend.dev is the default sending domain, which can only send
// to your signup email (expierytracker@gmail.com) until a custom domain is verified in Resend.
export const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
