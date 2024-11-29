import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { typographyHtmlSnippets } from './shared/typography-html-snippets';

interface Typography {
  html: string;
  size: string;
  weight: string;
  letterCase: string;
  letterSpacing: string;
}

const typeScaleSmall: Typography[] = [
  {
    html: typographyHtmlSnippets.h1.tag,
    size: 'XL',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.h2.tag,
    size: 'L',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.h3.tag,
    size: 'M',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.h4.tag,
    size: 'M',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.h5.tag,
    size: 'M',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.textL.class,
    size: 'L',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.bodyTextM.tag,
    size: 'M',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.textS.tag,
    size: 'S',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.textLHighlighted.class,
    size: 'L',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.bodyTextMHighlighted.tag,
    size: 'M',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.textSHighlighted.tag,
    size: 'S',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.button.storybook,
    size: 'M',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.label.class,
    size: 'S',
    weight: 'Semi-bold',
    letterCase: 'All caps',
    letterSpacing: '1.25px',
  },
  {
    html: typographyHtmlSnippets.link.class,
    size: 'M',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.linkS.class,
    size: 'S',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
];

const typeScaleLarge: Typography[] = [
  {
    html: typographyHtmlSnippets.h1.tag,
    size: 'XXL',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.h2.tag,
    size: 'XL',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    html: typographyHtmlSnippets.h3.tag,
    size: 'L',
    weight: 'Semi-bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-typography-overview',
  templateUrl: './storybook-typography-overview.component.html',
  styleUrls: ['./storybook-typography-overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatTableModule],
})
export class StorybookTypographyOverviewComponent {
  /**
   * @ignore
   */
  displayedColumns: string[] = ['name', 'size', 'weight', 'letterCase', 'letterSpacing'];
  /**
   * @ignore
   */
  dataSourceLarge = typeScaleLarge;
  /**
   * @ignore
   */
  dataSourceSmall = typeScaleSmall;
}
