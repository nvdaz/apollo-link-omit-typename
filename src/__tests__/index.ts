import { ApolloLink, execute, Operation } from '@apollo/client/link/core';
import gql from 'graphql-tag';

import OmitTypenameLink from '..';

class TestLink extends ApolloLink {
  public operation: Operation;

  request(operation: Operation) {
    this.operation = operation;
  }
}

describe('OmitTypenameLink', () => {
  let omitTypenameLink: OmitTypenameLink;
  let testLink: TestLink;
  let link: ApolloLink;

  beforeEach(() => {
    omitTypenameLink = new OmitTypenameLink();
    testLink = new TestLink();
    link = ApolloLink.from([omitTypenameLink, testLink]);
  });

  it('omits typename from variables', () => {
    return new Promise<void>((resolve) => {
      execute(link, {
        query: gql`
          query Q($v: Z!) {
            q(v: $v)
          }
        `,
        variables: { v: { __typename: 'T', a: 'a' } },
      }).subscribe({
        complete() {
          expect('__typename' in testLink.operation.variables.v).toBe(false);

          resolve();
        },
      });
    });
  });
});
