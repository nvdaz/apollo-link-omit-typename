# apollo-link-omit-typename

> Apollo Link that omits typename fields from operation variables

## Installation

```sh
yarn add apollo-link-omit-typename
```

## Usage

```ts
import { ApolloLink, HttpLink } from '@apollo/client';
import OmitTypenameLink from 'apollo-link-omit-typename';

const link = ApolloLink.from([
  new OmitTypenameLink(),
  new HttpLink({
    uri: 'uri',
  }),
]);

```
