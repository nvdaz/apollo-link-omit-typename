import deepOmit from '../deepOmit';

describe('deepOmit', () => {
  it('omits key and keeps extraneous properties', () => {
    const obj = {
      __typename: 'Test',
      a: 'a',
      b: 0,
      c: null as null,
      d: {
        __typename: 'Test',
        a: 'a',
        b: 0,
        c: null as null,
        d: [
          {
            __typename: 'Test',
            a: 'a',
            b: 0,
            c: null as null,
          },
        ],
      },
    };

    const objToMatch = {
      a: 'a',
      b: 0,
      c: null as null,
      d: {
        a: 'a',
        b: 0,
        c: null as null,
        d: [
          {
            a: 'a',
            b: 0,
            c: null as null,
          },
        ],
      },
    };

    const omitted = deepOmit(obj, '__typename');

    expect(deepOmit(obj, '__typename')).toMatchObject(objToMatch);
  });
});
