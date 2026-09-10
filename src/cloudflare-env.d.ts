declare module "cloudflare:workers" {
  export const env: {
    RESEND_API_KEY?: string;
    RFQ_FROM_EMAIL?: string;
    RFQ_RECIPIENTS?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    [key: string]: string | undefined;
  };
}