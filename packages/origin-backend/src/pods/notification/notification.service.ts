import { Injectable, Logger } from '@nestjs/common';
import {
    SupportedEvents,
    OrganizationInvitationEvent,
    NewEvent
} from '@energyweb/origin-backend-core';
import { MailService } from '../mail';
import EmailTypes from './EmailTypes';

type TSupportedNotificationEvent = {
    type: SupportedEvents.ORGANIZATION_INVITATION;
    data: OrganizationInvitationEvent;
};

const SUPPORTED_EVENTS = [SupportedEvents.ORGANIZATION_INVITATION];

function assertIsSupportedEvent(event: NewEvent): asserts event is TSupportedNotificationEvent {
    if (!SUPPORTED_EVENTS.includes(event.type)) {
        throw new Error(`Event is not supported: ${event.type}`);
    }
}

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    private handlers = {
        [SupportedEvents.ORGANIZATION_INVITATION]: async (data: OrganizationInvitationEvent) => {
            const url = `${process.env.UI_BASE_URL}/organization/organization-invitations`;

            await this.sendNotificationEmail(
                EmailTypes.ORGANIZATION_INVITATION,
                data.email,
                `Organization ${data.organizationName} has invited you to join the organization. To accept the invitation, please visit <a href="${url}">${url}</a>`
            );
        }
    };

    constructor(private readonly mailService: MailService) {}

    async handleEvent(event: NewEvent) {
        try {
            assertIsSupportedEvent(event);

            return this.handlers[event.type](event.data);
        } catch {
            return false;
        }
    }

    private async sendNotificationEmail(
        notificationType: EmailTypes,
        emailAddress: string,
        html: string
    ) {
        this.logger.log(`Sending "${notificationType}" email to ${emailAddress}...`);

        const result = await this.mailService.send({
            to: [emailAddress],
            subject: `[Origin] ${notificationType}`,
            html
        } as any);

        if (result) {
            this.logger.log(`Sent "${notificationType}" email to ${emailAddress}.`);
        } else {
            this.logger.error(`Can't send e-mail "${notificationType}"`);
        }

        return result;
    }
}
