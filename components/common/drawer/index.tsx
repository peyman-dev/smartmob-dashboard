// components/DynamicDrawer.tsx
import React from 'react';
import { Drawer, DrawerProps } from 'antd';
import clsx from 'clsx';

interface DynamicDrawerProps extends Omit<DrawerProps, 'open' | 'onClose'> {
  open: boolean;
  onClose?: () => void;
  toggle?: () => void; // optional, if you want to allow closing from inside
  children?: React.ReactNode;
}

const DynamicDrawer: React.FC<DynamicDrawerProps> = ({
  open,
  onClose,
  toggle,
  children,
  title = '',
  placement = 'right',
  width = 400,
  ...rest
}) => {
  const handleClose = () => {
    onClose?.();
    toggle?.();
  };

  return (
    <Drawer
      title={title}
      placement={placement}
      open={open}
      onClose={handleClose}
      width={width}
      className={clsx("**:font-estedad!", rest?.className)}
      closeIcon={null} // optional: remove default close icon if you handle it yourself
      {...rest}
    >
      {children}
    </Drawer>
  );
};

export default DynamicDrawer;