import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { render } from '@testing-library/react';
import { Select } from '@awsui/components-react';

import { SettingsPanel } from '..';
import { ExpandableInfoSection } from '../CommonPanelComponents';
import { useStore } from '../../../store';
import { setFeatureConfig } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../interfaces';
import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

jest.mock('../scene-settings', () => {
  const originalModule = jest.requireActual('../scene-settings');
  return {
    ...originalModule,
    SceneDataBindingTemplateEditor: 'SceneDataBindingTemplateEditor',
    SceneTagSettingsEditor: 'SceneTagSettingsEditor',
  };
});

configure({ adapter: new Adapter() });
describe('SettingsPanel contains expected elements.', () => {
  it('should contains expected elements.', async () => {
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn().mockReturnValue(true),
    });

    const wrapper = shallow(<SettingsPanel />);

    const expandableInfoSection = wrapper.find(ExpandableInfoSection);
    expect(expandableInfoSection.length).toEqual(2);
    expect(expandableInfoSection.at(1).props().title).toEqual('Scene Settings');

    const selectProps = expandableInfoSection.find(Select).props();

    expect(selectProps.selectedOption).toEqual({
      label: 'Neutral',
      value: 'neutral',
    });

    selectProps.onChange({ detail: { selectedOption: { value: 'value' } } });
    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty.mock.calls[0][1]).toEqual('value');
    setSceneProperty.mockReset();

    selectProps.onChange({ detail: { selectedOption: { value: 'n/a' } } });
    expect(setSceneProperty).toBeCalledTimes(1);
    expect(setSceneProperty.mock.calls[0][1]).toEqual(undefined);
    setSceneProperty.mockReset();
  });

  it('should contains default elements in editing mode.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.TagResize]: false });
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn().mockReturnValue(true),
    });

    const { queryByText } = render(<SettingsPanel valueDataBindingProvider={mockProvider} />);

    expect(queryByText('Current View Settings')).toBeTruthy();
    expect(queryByText('Scene Settings')).toBeTruthy();
    expect(queryByText('Tag Settings')).toBeFalsy();
    expect(queryByText('Data Binding Template')).toBeTruthy();
  });

  it('should contains default elements in viewing mode.', async () => {
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
      isEditing: jest.fn().mockReturnValue(false),
    });

    const { queryByText } = render(<SettingsPanel valueDataBindingProvider={mockProvider} />);

    expect(queryByText('Current View Settings')).toBeTruthy();
    expect(queryByText('Scene Settings')).toBeFalsy();
    expect(queryByText('Tag Settings')).toBeFalsy();
    expect(queryByText('Data Binding Template')).toBeFalsy();
  });

  it('should contains tag settings element.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.TagResize]: true });
    const setSceneProperty = jest.fn();
    useStore('default').setState({
      setSceneProperty: setSceneProperty,
      getSceneProperty: jest.fn().mockReturnValue('neutral'),
    });

    const { queryByText } = render(<SettingsPanel />);

    expect(queryByText('Tag Settings')).toBeTruthy();
  });
});
