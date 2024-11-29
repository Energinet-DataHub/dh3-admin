import { Component } from '@angular/core';

import { WattIcon } from '../icons';
import { WattIconComponent } from '../icon.component';

interface Icon {
  name: string;
  icon: WattIcon;
}

interface IconGroup {
  name?: string;
  icons: Icon[];
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-icon-overview',
  templateUrl: './storybook-icon-overview.component.html',
  styleUrls: ['./storybook-icon-overview.component.scss'],
  standalone: true,
  imports: [WattIconComponent],
})
export class StorybookIconOverviewComponent {
  /**
   * @ignore
   */
  icons: IconGroup[] = [
    {
      icons: [
        { name: 'Search', icon: 'search' },
        { name: 'Toggle On', icon: 'toggleOn' },
        { name: 'Toggle Off', icon: 'toggleOff' },
        { name: 'Filter', icon: 'filter' },
        { name: 'Plus', icon: 'plus' },
        { name: 'Minus', icon: 'minus' },
        { name: 'Help', icon: 'help' },
        { name: '@', icon: 'alternateEmail' },
        { name: 'language', icon: 'language' },
        { name: 'Pending Actions', icon: 'pendingActions' },
      ],
    },
    {
      icons: [
        { name: 'Edit', icon: 'edit' },
        { name: 'Remove', icon: 'remove' },
        { name: 'Remove forever', icon: 'removeForever' },
        { name: 'Menu', icon: 'menu' },
        { name: 'Log out', icon: 'logout' },
      ],
    },
    {
      icons: [
        { name: 'Refresh', icon: 'refresh' },
        { name: 'Redo', icon: 'redo' },
        { name: 'Undo', icon: 'undo' },
        { name: 'Close', icon: 'close' },
        { name: 'Cancel', icon: 'cancel' },
        { name: 'Checkmark', icon: 'checkmark' },
      ],
    },
    {
      icons: [
        { name: 'User', icon: 'user' },
        { name: 'Settings', icon: 'settings' },
        { name: 'ContentCopy', icon: 'contentCopy' },
      ],
    },
    {
      icons: [
        { name: 'Date', icon: 'date' },
        { name: 'Time', icon: 'time' },
      ],
    },
    {
      icons: [
        { name: 'E-mail', icon: 'email' },
        { name: 'Mark Email Unread', icon: 'markEmailUnread' },
        { name: 'Link', icon: 'link' },
        { name: 'Open In New', icon: 'openInNew' },
        { name: 'Notifications', icon: 'notifications' },
        { name: 'Notifications Unread', icon: 'notificationsUnread' },
      ],
    },
    {
      name: 'navigation',
      icons: [
        { name: 'Account', icon: 'account' },
        { name: 'Left', icon: 'left' },
        { name: 'Right', icon: 'right' },
        { name: 'Up', icon: 'up' },
        { name: 'Down', icon: 'down' },
        { name: 'Arrow Drop Down', icon: 'arrowDropDown' },
        { name: 'Arrow Right Alt', icon: 'arrowRightAlt' },
      ],
    },
    {
      name: 'alerts',
      icons: [
        { name: 'Danger', icon: 'danger' },
        { name: 'Warning', icon: 'warning' },
        { name: 'Success', icon: 'success' },
        { name: 'Info', icon: 'info' },
        { name: 'Feedback', icon: 'feedback' },
      ],
    },
    {
      name: 'files',
      icons: [
        { name: 'Save', icon: 'save' },
        { name: 'Upload', icon: 'upload' },
        { name: 'Download', icon: 'download' },
        { name: 'Print', icon: 'print' },
        { name: 'Preview', icon: 'preview' },
      ],
    },
    {
      icons: [
        { name: 'Forward Message', icon: 'forwardMessage' },
        { name: 'Monetization', icon: 'monetization' },
        { name: 'Payments', icon: 'payments' },
      ],
    },
    {
      icons: [
        { name: 'Power', icon: 'power' },
        { name: 'Windmill', icon: 'windmill' },
        { name: 'Solar Power', icon: 'solarPower' },
        { name: 'Location', icon: 'location' },
        { name: 'Smart Display', icon: 'smartDisplay' },
      ],
    },
  ];
}
