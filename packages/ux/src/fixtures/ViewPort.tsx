import React, { ReactElement, FunctionComponent } from 'react';

// Types
interface BrandedBorderProps {
  children?: ReactElement;
  size?: FrameSize;
}

// Styles
const viewportStyle = {
  backgroundColor: 'black',
  height: '100%',
};

// Components

/**
 * ViewPort
 * A framing view for use in Storybooks, with an adjustable padding size
 *
 */
const ViewPort: FunctionComponent<BrandedBorderProps> = ({ children, size = 'NONE' }) => {
  if (size === 'NONE') {
    return children || <div/>;
  }
  const lcSize = `${size}`.toLowerCase();
  return (
    <div style={viewportStyle} className={`${lcSize}`}>
      {children || <div />}
    </div>
  );
};
ViewPort.displayName = 'ASViewPort';

export default ViewPort;
