import { createViewOptionStateSlice } from './ViewOptionStateSlice';

describe('createViewOptionStateSlice', () => {
  it('should be able to change motioon indicator visibility', () => {
    const draft = { lastOperation: undefined, noHistoryStates: { motionIndicatorVisible: false } };

    const get = jest.fn();
    const set = jest.fn(((callback) => callback(draft)) as any);

    const { toggleMotionIndicatorVisibility } = createViewOptionStateSlice(set, get, undefined as any);
    toggleMotionIndicatorVisibility();

    expect(draft.lastOperation!).toEqual('toggleMotionIndicatorVisibility');
    expect(draft.noHistoryStates.motionIndicatorVisible).toBeTruthy();

    toggleMotionIndicatorVisibility();

    expect(draft.lastOperation!).toEqual('toggleMotionIndicatorVisibility');
    expect(draft.noHistoryStates.motionIndicatorVisible).toBeFalsy();
  });

  it('should be able to change tag settings', () => {
    const draft = { lastOperation: undefined, noHistoryStates: { tagSettings: {} as any } };

    const get = jest.fn();
    const set = jest.fn(((callback) => callback(draft)) as any);

    const { setTagSettings } = createViewOptionStateSlice(set, get, undefined as any);
    setTagSettings({ scale: 3.3, autoRescale: true });

    expect(draft.lastOperation!).toEqual('setTagSettings');
    expect(draft.noHistoryStates.tagSettings.scale).toEqual(3.3);
    expect(draft.noHistoryStates.tagSettings.autoRescale).toBeTruthy();
  });
});
