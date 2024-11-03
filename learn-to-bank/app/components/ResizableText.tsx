import { Text, TextProps } from '@geist-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ResizableTextProps extends TextProps {
  children: React.ReactNode;
}

const getInitialSize = (props: TextProps, textScale: number): number => {
  if (props.h1) return textScale + 22;
  if (props.h2) return textScale + 14;
  if (props.h3) return textScale + 10;
  if (props.h4) return textScale + 6;
  if (props.h5) return textScale + 4;
  if (props.h6) return textScale + 2;
  if (props.small) return textScale - 1;
  return textScale; // default size
};

const ResizableText: React.FC<ResizableTextProps> = ({ 
  children, 
  ...textProps
}) => {
  const { textScale } = useSelector((state: RootState) => state.app);
  const fontSize = getInitialSize(textProps, textScale);

  return (
    <Text {...textProps} style={{ ...textProps.style, fontSize: `${fontSize}px` }}>
      {children}
    </Text>
  );
};

export default ResizableText;