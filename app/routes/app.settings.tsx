import { Button, Input, Select, Slider, Spacer, Text, Grid } from "@geist-ui/core";
import { Card, Page } from '@geist-ui/react';
import ResizableText from '~/components/ResizableText';
import { setTextScale } from '~/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';
import { useState } from "react";
import { Form } from "@remix-run/react";



export default function Settings() {
  const dispatch = useDispatch();
  const { textScale } = useSelector((state: RootState) => state.app);
  const [previewFont, setPreviewFont] = useState(textScale);
  const [passwordError1, setPasswordError1] = useState<string | null>(null);
  const [passwordError2, setPasswordError2] = useState<string | null>(null);



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("firstName") as string;
    const theme = formData.get("theme") as string;
    const textSize = Number(formData.get("textSize"));

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    // Wrong current password
    if (currentPassword) {
      setPasswordError1("Incorrect Password");
      setPasswordError2(null);
      return;
    }

    // Empty Current password
    if (!currentPassword && (newPassword || confirmNewPassword)) {
      setPasswordError1("Please enter your current password to update your password");
      setPasswordError2(null);
      return;
    }

    // Empty new password
    if (currentPassword && (!newPassword || !confirmNewPassword)) {
      setPasswordError2("Please enter a new password to update your password");
      setPasswordError1(null);
      return;
    }

    // Not matching new password
    if (newPassword !== confirmNewPassword) {
      setPasswordError2("New Passwords Do Not Match - Please Try Again.");
      setPasswordError1(null);
      return;
    }
    
    dispatch(setTextScale(previewFont));
    alert("Settings saved!");
  };

  const previewText = (value: number | number[]) => {
    if (typeof value === "number") {
      setPreviewFont(value);
    }
  }


  return (
    <Page>
      <Page.Content style={{ display: "flex", justifyContent: "center"}}>
        <Card style={{ width: "550px"}}>
          <Text h2>Settings</Text>
          <Form method="post" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Grid.Container style={{ display: "flex", width: "100%", flexDirection: "column", gap: 16 }}>
              <Grid>
                <Text h5>Edit Name</Text>
                <Input
                  name="firstName"
                  placeholder="First Name"
                  initialValue={"John"}
                  width="100%" 
                  clearable
                  required 
                  crossOrigin={undefined} 
                  onPointerEnterCapture={undefined} 
                  onPointerLeaveCapture={undefined} 
                />
                <Spacer h={1}/>
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  initialValue={"Banker"}
                  width="100%" 
                  clearable
                  required 
                  crossOrigin={undefined} 
                  onPointerEnterCapture={undefined} 
                  onPointerLeaveCapture={undefined} 
                />
              </Grid>
              <Grid>
                <Text h5>Change Password</Text>
                <Input.Password 
                  name="currentPassword"
                  placeholder="Current Password"
                  width="100%"
                  clearable
                  crossOrigin={undefined} 
                  onPointerEnterCapture={undefined} 
                  onPointerLeaveCapture={undefined} 
                />
                {passwordError1 && <ResizableText type="error" >{passwordError1}</ResizableText>}
                {passwordError1? <></>: <Spacer h={1.8}/>}
                <Input.Password 
                  name="newPassword"
                  placeholder="New Password"
                  width="100%"
                  clearable
                  crossOrigin={undefined} 
                  onPointerEnterCapture={undefined} 
                  onPointerLeaveCapture={undefined} 
                />
                <Spacer h={1}/>
                <Input.Password 
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  width="100%"
                  clearable
                  crossOrigin={undefined} 
                  onPointerEnterCapture={undefined} 
                  onPointerLeaveCapture={undefined} 
                />
                {passwordError2 && <ResizableText type="error" style={{ marginTop: 10 }}>{passwordError2}</ResizableText>}
              </Grid>
              <Grid>
                <Text h5>Change Theme</Text>
                <Select name="theme" initialValue={"light"}>
                  <Select.Option value="light">Light</Select.Option>
                  <Select.Option value="dark">Dark</Select.Option>
                </Select>
              </Grid>
              <Grid>
                <Text h5>Change Text Size</Text>
                <Spacer h={1}/>
                <Slider
                  min={10}
                  max={32}
                  step={1}
                  value={previewFont}
                  onChange={previewText}
                  style={{ width: "100%" }}
                />
                <Spacer h={1}/>
                <Slider initialValue={textScale} step={1} max={32} min={10} onChange={(value) => { dispatch(setTextScale(value)) }} width="100%" />
                <Spacer h={1}/>
                <Card style={{ fontSize: `${previewFont}px` }}>
                  <Text h3>Preview</Text>
                  <Text>
                    This is a sample text. Adjust the slider above to change its size!
                  </Text>
                </Card>
              </Grid>
              <Button type="success" htmlType="submit"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
              >
                Save Settings
              </Button>
            </Grid.Container>
          </Form>
          <Spacer h={1}/>
          <Button auto type="error" ghost style={{ width: "100%"}}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
          >
            Delete Account
          </Button>
        </Card>
      </Page.Content>
    </Page>
  );
}


