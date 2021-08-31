import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { TypographyComponent } from './typography.component';

export default {
  title: 'Foundations/Typography',
  component: TypographyComponent,
  decorators: [
    moduleMetadata({
      imports: [MatTableModule, MatCardModule],
    }),
  ],
} as Meta<TypographyComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<TypographyComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Typography = Template.bind({});
Typography.parameters = {
  docs: {
    page: null,
  },
};

export const TypographyUsage = () => ({
  template: `
    <h1>
      Headline 1
    </h1>

    <h2>
      Headline 2
    </h2>

    <h3>
      Headline 3
    </h3>

    <h4>
      Headline 4
    </h4>

    <h5>
      Headline 5
    </h5>

    <p class="watt-text-l">
      Lead (text-l)
    </p>

    <p>
      Body (text-m)
    </p>

    <p>
      <small>
        Small (text-s)
      </small>
    </p>

    <p class="watt-text-xs">
      Extra small (text-xs)
    </p>

    <p class="watt-button">
      Button
    </p>

    <p class="watt-overline">
      Label
    </p>
  `,
});
TypographyUsage.storyName = 'Typography - Usage';
TypographyUsage.parameters = {
  docs: {
    page: null,
  },
};
