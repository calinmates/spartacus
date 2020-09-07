import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { NotificationMessageComponent } from './notification.component';

@NgModule({
  imports: [CommonModule, I18nModule, IconModule],
  declarations: [NotificationMessageComponent],
})
export class NotificationMessageModule {}
