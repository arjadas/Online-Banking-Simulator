import { Button } from '@geist-ui/core';
import { Shuffle, User, Grid as GridIcon } from '@geist-ui/react-icons';
import { useNavigate } from '@remix-run/react';

const containerStyle: any = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 20,
};

const buttonContainerStyle: any = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const buttonStyle = {
  width: 400,
  height: 75,
  fontSize: 18,
};

export default function Pay() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <main>
        <div style={buttonContainerStyle}>
          <Button style={buttonStyle} auto scale={2} icon={<Shuffle  />} onClick={() => { navigate("/app/transfer") }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Transfer between accounts
          </Button>
          <Button style={buttonStyle} auto scale={2} icon={<User />} onClick={() => { navigate("/app/paySomeone") }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Pay someone
          </Button>
          <Button style={buttonStyle} auto scale={2} icon={<GridIcon />} onClick={() => { navigate("/app/accounts") }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Default Payments
          </Button>
        </div>
      </main>
    </div>
  );
}