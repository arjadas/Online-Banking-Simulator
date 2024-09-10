import { Button } from '@geist-ui/core';
import { Shuffle, User, Grid as GridIcon, Calendar } from '@geist-ui/react-icons';
import { useNavigate } from '@remix-run/react';
import React, { useCallback } from 'react';

const containerStyle: any = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const buttonContainerStyle: any = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const buttonStyle = {
  width: '400px',
  height: '75px',
  fontSize: '18px',
};

export default function Pay() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/app/transfer");
  };

  return (
    <div style={containerStyle}>
      <main>
        <div style={buttonContainerStyle}>
          <Button style={buttonStyle} icon={<Shuffle />} onClick={handleClick} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Transfer between accounts
          </Button>
          <Button style={buttonStyle} icon={<GridIcon />} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Default Payments
          </Button>
          <Button style={buttonStyle} icon={<User />} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Pay someone
          </Button>
          <Button style={buttonStyle} icon={<Calendar />} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Schedule payments
          </Button>
        </div>
      </main>
    </div>
  );
}