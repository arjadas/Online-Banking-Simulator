import { Button, Input, Select, Slider, Spacer, Text, Grid, Modal } from "@geist-ui/core";
import { Card, Page } from '@geist-ui/react';
import ResizableText from '~/components/ResizableText';
import { setTextScale } from '~/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';
import { useState } from "react";
import { Form, useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { ActionFunction, LoaderFunction, json } from '@remix-run/cloudflare';
import { getPrismaClient } from '~/service/db.server';
import { getUserSession } from '../auth.server';
import { sendResetPasswordEmail } from "~/auth.client";
import { User } from '@prisma/client';

type ActionData = {
  error?: string;
  success?: string;
};

export const action: ActionFunction = async ({ context, request } : { context: any, request: Request }) => {
  const formData = await request.formData();
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  const actionType = formData.get('actionType');

  if (actionType === "saveSettings"){
    const first_name = formData.get("firstName") as string;
    const last_name = formData.get("lastName") as string;
    const font_preference = formData.get("fontSize") as string;
    const theme_preference = formData.get("theme") as string;

    // try {
    //   await db.user.update({
    //     where: { uid: user!.uid },
    //     data: { first_name, last_name, font_preference},
    //   });

    //   return json ({ success: "New settings saved" });
    // } catch(error: any) {
    //   return json ({ error: error.message });
    // }
    return json ({ success: "New settings saved" });
  }

  if (actionType === "sendEmail") {
    const email = formData.get("email") as string;

    // try {
    //   await sendResetPasswordEmail(email);
    //   return json ({ success: "Password reset email sent!" });
    // } catch (error: any) {
    //   return json ({ error: error.message });
    // }
    return json ({ success: "Password reset email sent!" });
  }

  if (actionType === "deleteAccount") {
    return null;
  }
  return null;
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  if (!user) return json({ error: 'Unauthenticated' }, { status: 401 });

  const [userData] = await Promise.all([
      db.user.findUnique({
          where: { uid: user!.uid }
      }),
  ]);

  if (!userData) {
      throw new Response("No user data Found! This is a catastrophic error since user should have been created on sign-up :/", { status: 404 });
  }

  return json({
      userData,
  });
};


export default function Settings() {
  const { userData: user } = useLoaderData<{ userData: User }>();
  const actionData = useActionData<ActionData>();
  const dispatch = useDispatch();
  const submit = useSubmit();
  const { textScale } = useSelector((state: RootState) => state.app);
  const [previewFont, setPreviewFont] = useState(textScale);
  const [modalState, setModalState] = useState(false);
  // const [passwordError1, setPasswordError1] = useState<string | null>(null);
  // const [passwordError2, setPasswordError2] = useState<string | null>(null);
  const [endResponse, setEndResponse] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("actionType", "saveSettings");
    formData.append("fontSize", String(previewFont));

    submit(formData, { method: "post" });
    dispatch(setTextScale(previewFont));
    setEndResponse(true);
  }

  const handleSendEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", user.uid);
    formData.append("actionType", "sendEmail")
    formData.append("email", user.email);
    submit(formData, { method: "post" });
    setEndResponse(false);
  }

  const handleDeleteAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
  }

  const previewText = (value: number | number[]) => {
    if (typeof value === "number") {
      setPreviewFont(value);
    }
  }

  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  return (
    <Page>
      <Page.Content style={{ display: "flex", justifyContent: "center"}}>
        <Card style={{ width: "550px"}}>
          <Text h2>Settings</Text>
          <Form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Grid.Container style={{ display: "flex", width: "100%", flexDirection: "column", gap: 16 }}>
              <Grid>
                <Text h5>Edit Name</Text>
                <Input
                  name="firstName"
                  placeholder="First Name"
                  initialValue={user.first_name}
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
                  initialValue={user.last_name}
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
                <Button auto onClick={handleSendEmail} style={{ width: "100%"}}
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                >
                  Reset password via Email
                </Button>
                {!endResponse && actionData?.error && <ResizableText type="error">{actionData.error}</ResizableText>}
                {!endResponse && actionData?.success && <ResizableText type="success">{actionData.success}</ResizableText>}
                {/*passwordError2 && <ResizableText type="error" style={{ marginTop: 10 }}>{passwordError2}</ResizableText>*/}
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
          {endResponse && actionData?.error && <ResizableText type="error">{actionData.error}</ResizableText>}
          {endResponse && actionData?.success && <ResizableText type="success">{actionData.success}</ResizableText>}
          <Spacer h={1}/>
          <Button auto onClick={openModal} type="error" ghost style={{ width: "100%"}}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
          >
            Delete Account
          </Button>
          <Modal visible={modalState} onClose={closeModal}>
            <Modal.Title>Delete Account</Modal.Title>
            <Modal.Subtitle>To confirm, type "DELETE"</Modal.Subtitle>
            <Modal.Content>
              <Form>
                <p>To confirm, type "DELETE"</p>
                <Input
                    name="delete"
                    placeholder="type here"
                    width="100%" 
                    clearable
                    required 
                    crossOrigin={undefined} 
                    onPointerEnterCapture={undefined} 
                    onPointerLeaveCapture={undefined}
                    
                />
              </Form>
              <p>Warning: Account deletion is permanent and irreversible—once deleted, all data will be lost!</p>
            </Modal.Content>
            <Modal.Action passive onClick={() => setModalState(false)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Cancel</Modal.Action>
            <Modal.Action placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Submit</Modal.Action>
          </Modal>
        </Card>
      </Page.Content>
    </Page>
  );
}