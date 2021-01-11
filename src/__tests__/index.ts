import { Observable } from '@apollo/client/core';
import {
  ApolloLink,
  execute,
  NextLink,
  Operation,
} from '@apollo/client/link/core';
import { createOperation, transformOperation } from '@apollo/client/link/utils';
import { setContext } from '@apollo/client/link/context';
import gql from 'graphql-tag';

import OmitTypenameLink from '..';
import deepOmit from '../deepOmit';

class TestLink extends ApolloLink {
  public operation: Operation;

  request(operation: Operation, forward: NextLink) {
    this.operation = operation;

    if (forward) {
      return forward(operation);
    }
  }
}

describe('OmitTypenameLink', () => {
  let prevLink: TestLink;
  let omitTypenameLink: OmitTypenameLink;
  let postLink: TestLink;

  let link: ApolloLink;

  beforeEach(() => {
    prevLink = new TestLink();
    omitTypenameLink = new OmitTypenameLink();
    postLink = new TestLink();
    link = ApolloLink.from([prevLink, omitTypenameLink, postLink]);
  });

  it('deep omits typename from variables', () => {
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
          expect(
            deepOmit(prevLink.operation.variables, '__typename')
          ).toMatchObject(postLink.operation.variables);

          resolve();
        },
      });
    });
  });

  it('persists context', () => {
    return new Promise<void>((resolve) => {
      execute(
        ApolloLink.from([
          setContext(() => ({
            z: 'z',
          })),
          link,
        ]),
        {
          query: gql`
            query Q {
              q
            }
          `,
        }
      ).subscribe({
        complete() {
          expect(typeof prevLink.operation.getContext).toBe('function');
          expect(typeof postLink.operation.getContext).toBe('function');

          expect(prevLink.operation.getContext()).toMatchObject(
            postLink.operation.getContext()
          );

          resolve();
        },
      });
    });
  });

  it('returns forwarded value', () => {
    const value = Observable.of();

    const operation = createOperation(
      undefined,
      transformOperation({
        query: gql`
          query Q {
            q
          }
        `,
      })
    );

    const result = omitTypenameLink.request(operation, () => value);

    expect(result).toStrictEqual(value);
  });

  it('forwards the operation', () => {
    const forward = jest.fn();

    const operation = createOperation(
      undefined,
      transformOperation({
        query: gql`
          query Q {
            q
          }
        `,
      })
    );

    omitTypenameLink.request(operation, forward);

    expect(forward).toBeCalledWith(operation);
  });
});
