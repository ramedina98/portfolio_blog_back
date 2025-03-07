import { Test, TestingModule } from '@nestjs/testing';
import { EmailFactory } from '../src/factories/EmailFactory';
import { IEFactory } from '../src/interfaces/IEmails';
import { GreetingEmail } from '../src/factories/GreetingEmail';
import { OpinionEmails } from '../src/factories/OpinionEmail';
import { WorkEmail } from '../src/factories/WorkEmail';
import { ErrorEmail } from '../src/factories/ErrorEmail';
import { ProposalEmail } from '../src/factories/ProposalEmail';
import { ReviewEmail } from '../src/factories/ReviewEmail';
import { SERVER } from 'src/config/config';

describe('EmailFactory', () => {
    let emailFactory: EmailFactory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailFactory],
        }).compile();

        emailFactory = module.get<EmailFactory>(EmailFactory);
    });

    it('should be defined', () => {
        expect(emailFactory).toBeDefined();
    });

    it('should create a GreetingEmail', () => {
        const options: IEFactory = { name: 'John', email: SERVER.EMAIL, tz: 'UTC', id_email: '123', message: 'Default message' };
        const email = EmailFactory.CreateEmail('greetings', options);
        expect(email).toBeInstanceOf(GreetingEmail);
    });

    it('should create an OpinionEmail', () => {
        const options: IEFactory = { id_email: '123', name: 'John', email: SERVER.EMAIL, tz: 'UTC', message: 'This is an opinion message' };
        const email = EmailFactory.CreateEmail('opinion', options);
        expect(email).toBeInstanceOf(OpinionEmails);
    });

    it('should create a WorkEmail', () => {
        const options: IEFactory = { name: 'John', email: SERVER.EMAIL, tz: 'UTC', message: 'This is a work message, and I am working on it', id_email: '123' };
        const email = EmailFactory.CreateEmail('work', options);
        expect(email).toBeInstanceOf(WorkEmail);
    });

    it('should create an ErrorEmail', () => {
        const options: IEFactory = { name: 'John', email: SERVER.EMAIL, tz: 'UTC', id_email: '123', message: 'Error message' };
        const email = EmailFactory.CreateEmail('error_report', options);
        expect(email).toBeInstanceOf(ErrorEmail);
    });

    it('should create a ProposalEmail', () => {
        const options: IEFactory = { id_email: '123', name: 'John', email: SERVER.EMAIL, tz: 'UTC', message: 'This is a proposal message' };
        const email = EmailFactory.CreateEmail('proposal', options);
        expect(email).toBeInstanceOf(ProposalEmail);
    });

    it('should create a ReviewEmail', () => {
        const options: IEFactory = { id_email: '123', name: 'John', email: SERVER.EMAIL, tz: 'UTC', message: 'This is a review message', article_title: 'Title', article_link: 'link', article_image: 'image' };
        const email = EmailFactory.CreateEmail('review', options);
        expect(email).toBeInstanceOf(ReviewEmail);
    });

    it('should return null for an unknown type', () => {
        const options: IEFactory = { id_email: '123', name: 'John', email: SERVER.EMAIL, tz: 'UTC', message: 'Hola a todos por alla' };
        const email = EmailFactory.CreateEmail('unknown', options);
        expect(email).toBeNull();
    });
});