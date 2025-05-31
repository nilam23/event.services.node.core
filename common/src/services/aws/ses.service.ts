import { SendEmailCommand, SendEmailCommandOutput, SESClient } from '@aws-sdk/client-ses';
import { ISESParams } from '@interfaces/helpers/aws.interface';
import { APIGatewayProxyResult } from 'aws-lambda';
import handlebars from 'handlebars';

export class AWSSes {
  private ses: SESClient;

  constructor(sesClient: SESClient) {
    this.ses = sesClient;
  }

  /**
   * @description compiles an HTML template string using Handlebars with provided replacements
   * @param {string} htmlTemplatePath raw HTML template string to compile
   * @param {any} replacements dynamic values to inject into the template
   * @returns the final HTML string after templating
   */
  public createEmailHtmlTemplate = (htmlTemplatePath: string, replacements: any): string => {
    handlebars.registerHelper('equal', (A: any, B: any) => A === B);
    const template: HandlebarsTemplateDelegate<any> = handlebars.compile(htmlTemplatePath);
    const html: string = template(replacements);

    return html;
  };

  /**
   * @description sends an email using the AWS SES client with the given parameters
   * @param {ISESParams} sesParams email details including recipients, subject, and body
   * @returns a promise resolving to the SES response after sending the email
   */
  public sendEmail = async (sesParams: ISESParams): Promise<SendEmailCommandOutput | APIGatewayProxyResult> => {
    try {
      if (!sesParams.htmlTemplate && !sesParams.bodyText) throw new Error('email body is mandatory');

      const command: SendEmailCommand = new SendEmailCommand({
        Source: sesParams.source,
        Destination: {
          ToAddresses: sesParams.toAddresses,
          CcAddresses: sesParams?.ccAddresses,
          BccAddresses: sesParams?.bccAddresses,
        },
        Message: {
          Subject: {
            Charset: 'UTF-8',
            Data: sesParams.subject,
          },
          Body: {
            ...(sesParams.bodyText && {
              Text: {
                Charset: 'UTF-8',
                Data: sesParams.bodyText,
              },
            }),
            ...(sesParams.htmlTemplate && {
              Html: {
                Charset: 'UTF-8',
                Data: sesParams.htmlTemplate,
              },
            }),
          },
        },
      });

      return await this.ses.send(command);
    } catch (error) {
      throw error;
    }
  };
}
