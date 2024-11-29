import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
  StoryContext,
} from '@storybook/angular';
import { WattDataTableComponent } from './watt-data-table.component';
import { WattButtonComponent } from '../button';
import { Table as TableStory } from '../table/watt-table.stories';
import { WATT_TABLE } from '../table';
import { WattIconComponent } from '../../foundations/icon/icon.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VaterStackComponent, VaterUtilityDirective } from '../vater';
import { WattFilterChipComponent } from '../chip';
import { WattDataFiltersComponent } from './watt-data-filters.component';

// Slightly hacky way to get the template from the table story
const tableStoryArgs = TableStory.args ?? {};
const tableStoryTemplate = TableStory(tableStoryArgs, {} as StoryContext).template;

const meta: Meta = {
  title: 'Components/Data Presentation',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      imports: [
        VaterStackComponent,
        VaterUtilityDirective,
        WattButtonComponent,
        WattFilterChipComponent,
        WattIconComponent,
        WATT_TABLE,
        WattDataTableComponent,
        WattDataFiltersComponent,
      ],
    }),
  ],
};

export default meta;

export const DataTable: StoryObj<WattDataTableComponent> = {
  render: (args) => ({
    props: { ...args, ...tableStoryArgs },
    template: `
      <watt-data-table vater inset="m">
        <h3>Results</h3>
        <watt-button icon="plus" variant="secondary">Add Element</watt-button>
        <watt-data-filters>
          <vater-stack fill="vertical" gap="s" direction="row">
            <watt-filter-chip choice [selected]="true" name="classification">Any Classification</watt-filter-chip>
            <watt-filter-chip choice name="classification">Metals</watt-filter-chip>
            <watt-filter-chip choice name="classification">Non-Metals</watt-filter-chip>
            <watt-filter-chip choice name="classification">Metalloids</watt-filter-chip>
            <watt-filter-chip choice name="classification">Noble Gases</watt-filter-chip>
          </vater-stack>
        </watt-data-filters>
        ${tableStoryTemplate}
      </watt-data-table>
    `,
  }),
};
