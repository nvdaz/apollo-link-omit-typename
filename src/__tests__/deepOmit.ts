import deepOmit from '../deepOmit';

class TestClass {}

describe('deepOmit', () => {
  it('omits key and keeps extraneous properties', () => {
    const testClass = new TestClass();

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
            d: testClass,
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
            d: testClass,
          },
        ],
      },
    };

    const omitted = deepOmit(obj, '__typename');

    expect(deepOmit(obj, '__typename')).toMatchObject(objToMatch);
  });
});
