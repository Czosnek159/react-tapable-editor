import React, { createRef, FC } from 'react';
import './styles/index.css';
import useFocus from '../../hooks/useFocus';
import useResize from '../../hooks/useResize';
import useAlignment from '../../hooks/useAlignment';
import { ImageProps } from '../../types';

const Image: FC<ImageProps> = props => {
  // createRef does not work. it will create a new instance on every function revoked.
  const ref = createRef<HTMLDivElement>();

  const { block, contentState } = props;
  useFocus({ nodeRef: ref, props });
  useResize({ nodeRef: ref, props });
  useAlignment({ nodeRef: ref, props });

  const meta = contentState.getEntity(block.getEntityAt(0)).getData();
  const { src } = meta;

  return (
    <div className="image-wrapper" ref={ref}>
      <img src={src} className="image" alt="wrapper" />
    </div>
  );
};

export default Image;
