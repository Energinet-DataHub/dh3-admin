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
function mixinSnippet(name: string) {
  return `@use '@energinet-datahub/watt/utils' as watt
@include watt.typography-watt-${name}
  `;
}

export const typographyHtmlSnippets = {
  h1: {
    tag: '<h1>headline 1</h1>',
    class: '<p class="watt-headline-1">headline 1</p>',
    mixin: mixinSnippet('headline-1'),
  },
  h2: {
    tag: '<h2>headline-2</h2>',
    class: '<p class="watt-headline-2">Headline-2</p>',
    mixin: mixinSnippet('headline-2'),
  },
  h3: {
    tag: '<h3>headline-3</h3>',
    class: '<p class="watt-headline-3">Headline-3</p>',
    mixin: mixinSnippet('headline-3'),
  },
  h4: {
    tag: '<h4>headline-4</h4>',
    class: '<p class="watt-headline-4">Headline-4</p>',
    mixin: mixinSnippet('headline-4'),
  },
  h5: {
    tag: '<h5>headline-5</h5>',
    class: '<p class="watt-headline-5">Headline-5</p>',
    mixin: mixinSnippet('headline-5'),
  },
  textL: {
    class: '<p class="watt-text-l">large</p>',
    mixin: mixinSnippet('text-l'),
  },
  bodyTextM: {
    tag: '<p>normal</p>',
    class: '<div class="watt-text-m">normal</div>',
    mixin: mixinSnippet('text-m'),
  },
  textS: {
    tag: '<p><small>small</small></p>',
    class: '<p class="watt-text-s">small</p>',
    mixin: mixinSnippet('text-s'),
  },
  textLHighlighted: {
    class: '<p class="watt-text-l-highlighted">large-highlighted</p>',
    mixin: mixinSnippet('text-l-highlighted'),
  },
  bodyTextMHighlighted: {
    tag: '<strong>normal-highligted</strong>',
    class: '<div class="watt-text-m-highlighted">normal-highlighted</div>',
    mixin: mixinSnippet('text-m-highlighted'),
  },
  textSHighlighted: {
    tag: '<p><small class="watt-text-s-highlighted">small-highlighted</small></p>',
    class: '<p class="watt-text-s-highlighted">small-highlighted</p>',
    mixin: mixinSnippet('text-s-highlighted'),
  },
  button: {
    storybook: '<p class="watt-button">button</p>',
    tag: '<button type="button">Button</button>',
    class: '<a class="watt-button" href="#">Button</a>',
    mixin: mixinSnippet('button'),
  },
  label: {
    tag: '<label>label</label>',
    class: '<p class="watt-label">label</p>',
    mixin: mixinSnippet('label'),
  },
  link: {
    tag: '<a>Normal Link</a>',
    class: '<p class="watt-link">normal link</p>',
    mixin: mixinSnippet('link'),
  },
  linkS: {
    tag: '<small><a>Small Link</a></small>',
    class: '<p class="watt-link-s">small link</p>',
    mixin: mixinSnippet('link-s'),
  },
};
