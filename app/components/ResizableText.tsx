import React, { useState, useEffect, ReactNode } from 'react';
import { Text, TextProps } from '@geist-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

interface ResizableTextProps extends TextProps {
  children: React.ReactNode;
}

const getInitialSize = (props: TextProps): number => {
  if (props.h1) return 32;
  if (props.h2) return 24;
  if (props.h3) return 20;
  if (props.h4) return 16;
  if (props.h5) return 14;
  if (props.h6) return 12;
  return 16; // default size
};

const ResizableText: React.FC<ResizableTextProps> = ({ 
  children, 
  ...textProps
}) => {
  const { textScale } = useSelector((state: RootState) => state.app);
  const initialSize = getInitialSize(textProps);
  const fontSize = (initialSize * textScale) / 100;

  return (
    <Text {...textProps} style={{ ...textProps.style, fontSize: `${fontSize}px` }}>
      {children}
    </Text>
  );
};

export default ResizableText;