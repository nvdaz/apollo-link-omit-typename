import { ApolloLink, NextLink, Operation } from '@apollo/client/link/core';
import deepOmit from './deepOmit';

export default class OmitTypenameLink extends ApolloLink {
  request(operation: Operation, forward: NextLink) {
    operation.variables = deepOmit(operation.variables, '__typename');

    return forward(operation);
  }
}
