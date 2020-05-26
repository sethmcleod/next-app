import { shallow } from 'enzyme';
import React from 'react';

import { Header } from './Header';

describe('Header', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  it('renders', () => {
    expect(wrapper).toBeDefined();
  });
});
