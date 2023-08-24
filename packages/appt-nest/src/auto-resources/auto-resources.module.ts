import { Module } from '@nestjs/common';
import { AudittrailModule } from './audit-trail/audit-trail.module';
import { CalendareventattendeesModule } from './calendar-event-attendees/calendareventattendees.module';
import { CalendareventModule } from './calendar-event/calendar-event.module';
import { ChunkUploadModule } from './chunk-upload/chunk-upload.module';
import { FormresponseModule } from './form-response/form-response.module';
import { FormsubmissionModule } from './form-submission/form-submission.module';
import { ListingModule } from './listing/listing.module';
import { MediaRestrictionModule } from './media-restriction/media-restriction.module';
import { MediaModule } from './media/media.module';
import { MessagingConversationModule } from './messaging/messaging-conversation/messaging-conversation.module';
import { MessagingMessageModule } from './messaging/messaging-message/messaging-message.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './order/order.module';
import { OrganisationChargeModule } from './organisation-charge/organisation-charge.module';
import { OrganisationContractModule } from './organisation-contract/organisation-contract.module';
import { OrganisationProductModule } from './organisation-product/organisation-product.module';
import { OrganisationsubscriptionModule } from './organisation-subscription/organisation-subscription.module';
import { OrganisationsystemtagModule } from './organisation-system-tag/organisation-system-tag.module';
import { OrganisationtagModule } from './organisation-tag/organisation-tag.module';
import { OrganisationUserPurchasesModule } from './organisation-user-purchases/organisation-user-purchases.module';
import { OrganisationModule } from './organisation/organisation.module';
import { RecordModule } from './record/record.module';
import { RoleuserModule } from './role-user/role-user.module';
import { RoleModule } from './role/role.module';
import { SiteadminModule } from './site-admin/site-admin.module';
import { SiteuserModule } from './site-user/site-user.module';
import { SiteModule } from './site/site.module';
import { SubscriptionreceiptModule } from './subscription-receipt/subscription-receipt.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TaskModule } from './task/task.module';
import { UserDeviceTokenModule } from './user-device-token/user-device-token.module';
import { UserdirectaccessModule } from './user-direct-access/user-direct-access.module';
import { UsergroupadminModule } from './user-group-admin/user-group-admin.module';
import { UsergroupmemberModule } from './user-group-member/user-group-member.module';
import { UsergroupModule } from './user-group/user-group.module';
import { UsernotificationModule } from './user-notification/user-notification.module';
import { UsertagModule } from './user-tag/user-tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AudittrailModule,
    CalendareventModule,
    CalendareventattendeesModule,
    FormresponseModule,
    FormsubmissionModule,
    MessagingConversationModule,
    MessagingMessageModule,
    OrderModule,
    OrganisationModule,
    OrganisationProductModule,
    OrganisationChargeModule,
    OrganisationContractModule,
    OrganisationUserPurchasesModule,
    OrganisationsubscriptionModule,
    OrganisationsystemtagModule,
    OrganisationtagModule,
    RecordModule,
    RoleModule,
    SiteModule,
    SiteadminModule,
    SiteuserModule,
    SubscriptionModule,
    SubscriptionreceiptModule,
    TaskModule,
    UserModule,
    UserdirectaccessModule,
    UsergroupModule,
    UsergroupadminModule,
    UsergroupmemberModule,
    UsernotificationModule,
    UsertagModule,
    UserDeviceTokenModule,
    NotificationModule,
    ListingModule,
    ChunkUploadModule,
    MediaRestrictionModule,
    MediaModule,
    RoleuserModule,
  ],
  exports: [
    AudittrailModule,
    CalendareventModule,
    CalendareventattendeesModule,
    FormresponseModule,
    FormsubmissionModule,
    MessagingConversationModule,
    MessagingMessageModule,
    OrderModule,
    OrganisationModule,
    OrganisationProductModule,
    OrganisationChargeModule,
    OrganisationContractModule,
    OrganisationUserPurchasesModule,
    OrganisationsubscriptionModule,
    OrganisationsystemtagModule,
    OrganisationtagModule,
    RecordModule,
    RoleModule,
    SiteModule,
    SiteadminModule,
    SiteuserModule,
    SubscriptionModule,
    SubscriptionreceiptModule,
    TaskModule,
    UserModule,
    UserdirectaccessModule,
    UsergroupModule,
    UsergroupadminModule,
    UsergroupmemberModule,
    UsernotificationModule,
    UsertagModule,
    UserDeviceTokenModule,
    NotificationModule,
    ListingModule,
    ChunkUploadModule,
    MediaRestrictionModule,
    MediaModule,
    RoleuserModule,
  ],
})
export class AutoResourceModule {}
