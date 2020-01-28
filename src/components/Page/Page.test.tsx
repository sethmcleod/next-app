import { shallow } from 'enzyme';
import React from 'react';

import { Page } from './Page';

describe('Page', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Page />);
  });

  it('renders', () => {
    expect(wrapper).toBeDefined();
  });
});

