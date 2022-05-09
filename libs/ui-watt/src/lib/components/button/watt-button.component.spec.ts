/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { render, screen } from '@testing-library/angular';
import { WattIcon } from '../../foundations/icon';
import {
  WattButtonComponent,
  WattButtonSize,
  WattButtonType,
  WattButtonTypes,
  WattButtonVariant,
} from './watt-button.component';
import { WattButtonModule } from './watt-button.module';

interface WattButtonOptionsType {
  icon?: WattIcon;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  variant?: WattButtonVariant;
  size?: WattButtonSize;
  type?: WattButtonType;
}

describe(WattButtonComponent.name, () => {
  const renderComponent = async ({ ...options }: WattButtonOptionsType) => {
    await render(
      `<watt-button
        variant=${options.variant}
        size=${options.size}
        icon=${options.icon}
        type=${options.type}
        [loading]=${options.loading}
        [disabled]=${options.disabled}>
          ${options.text ?? 'Text'}
      </watt-button>`,
      { imports: [WattButtonModule] }
    );
  };

  it('renders default options', async () => {
    await render('<watt-button>Default button</watt-button>', {
      imports: [WattButtonModule],
    });

    expect(screen.getByRole('button')).toHaveTextContent('Default button');
    expect(screen.getByRole('button')).toHaveClass('watt-button--normal');
    expect(screen.getByRole('button')).toHaveClass('watt-button--primary');
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button')).not.toHaveClass('mat-button-disabled');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders text content', async () => {
    await renderComponent({ text: 'Text' });

    expect(screen.getByRole('button')).toHaveTextContent('Text');
  });

  it('renders icon when icon is set', async () => {
    await renderComponent({ icon: 'plus' });

    expect(screen.getByRole('img')).toHaveClass('mat-icon');
  });

  test.each(WattButtonTypes)(
    'renders variant "%s" as a class',
    async (variant) => {
      await renderComponent({ variant, text: 'Text' });

      if (variant === 'icon') {
        expect(screen.getByRole('button')).not.toHaveTextContent('Text');
      }
      expect(screen.getByRole('button')).toHaveClass('watt-button--' + variant);
    }
  );

  it('renders size as a class', async () => {
    await renderComponent({ size: 'large' });

    expect(screen.getByRole('button')).toHaveClass('watt-button--large');
  });

  it('renders type', async () => {
    await renderComponent({ type: 'reset' });

    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('can be disabled', async () => {
    await renderComponent({ disabled: true });

    expect(screen.getByRole('button')).toHaveClass('mat-button-disabled');
  });

  it('renders loading spinner, but no text, when loading is true ', async () => {
    await renderComponent({ loading: true, text: 'Text' });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toHaveTextContent('Text');
  });
});
