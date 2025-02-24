/**
 * @EmailFactory
 * This class called EmailFactory helps to determine which is the correct object to create based on the type provided.
 * It supports creating the following types of emails:
 * 1. Greetings
 * 2. Error
 * 3. Work
 * 4. Opinion
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 */
import { IEFactory } from "../interfaces/IEmails";
// These are the classes that represent the emails of my portfolio...
import { GreetingEmail } from "./GreetingEmail";
import { OpinionEmails } from "./OpinionEmail";
import { WorkEmail } from "./WorkEmail";
import { ErrorEmail } from "./ErrorEmail";
// And these are the classes that represent the emails of the blog...
import { ProposalEmail } from "./ProposalEmail";

class EmailFactory {
    static CreateEmail(type: string, option: IEFactory): object | null{
        switch(type){
            // These are the option of emails that can be created in my portfolio...
            case 'greetings':
                return new GreetingEmail(option.name, option.email, option.tz);
            case 'opinion':
                return new OpinionEmails(option.name, option.email, option.id_email);
            case 'work':
                return new WorkEmail(option.name, option.email, option.tz, option.id_email);
            case 'error_report':
                return new ErrorEmail(option.name, option.email, option.tz, option.id_email, option.message);
            // And these are the options of emails that can be created in the blog...
            case 'proposal':
                return new ProposalEmail(option.name, option.email, option.tz, option.id_email);
        }
        return null;
    }
}

export { EmailFactory };