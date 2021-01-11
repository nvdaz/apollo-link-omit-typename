import { Observable } from '@apollo/client/core';
import {
  ApolloLink,
  FetchResult,
  NextLink,
  Operation,
} from '@apollo/client/link/core';
import deepOmit from './deepOmit';

export default class OmitTypenameLink extends ApolloLink {
  constructor() {
    super();
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    operation.variables = deepOmit(operation.variables, '__typename');

    return forward(operation);
  }
}
