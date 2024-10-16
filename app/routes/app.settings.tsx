import { Slider, Spacer } from '@geist-ui/core';
import { Card, Page } from '@geist-ui/react';
import ResizableText from '~/components/ResizableText';
import { setTextScale } from '~/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';

const Settings = () => {
  const dispatch = useDispatch();
  const { textScale } = useSelector((state: RootState) => state.app);
  
  return (
    <Page>
      <Page.Content>
        <Card shadow width="100%" height="500px" style={{ maxWidth: '1000px', margin: '0 auto' }} padding={2}>
          <ResizableText h3>Text Size</ResizableText >
          <Spacer h={1} />  
          <Slider initialValue={textScale} step={10} max={250} min={80} onChange={(value) => { dispatch(setTextScale(value)) }} showMarkers width="50%" />
        </Card>
      </Page.Content>
    </Page>
  );
};

export default Settings;