import { Button, Grid, Input, Modal, Slider, Spacer, Text } from "@geist-ui/core";
import { Card, Page } from '@geist-ui/react';
import { User } from '@prisma/client';
import { ActionFunction, LoaderFunction, json } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { deleteUser } from "firebase/auth";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setTextScale } from '../appSlice';
import { sendResetPasswordEmail } from "../auth.client";
import { getUserSession } from '../auth.server';
import ResizableText from '../components/ResizableText';
import { getPrismaClient } from '../service/db.server';
import { RootState } from '../store';

type ActionData = {
  error?: string;
  success?: string;
};

export const action: ActionFunction = async ({ context, request } : { context: any, request: Request }) => {
  const formData = await request.formData();
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  const actionType = formData.get("actionType");

  if (actionType === "saveSettings"){
    const first_name = formData.get("firstName") as string;
    const last_name = formData.get("lastName") as string;
    const font_preference = formData.get("fontSize") as string;

    try {
      await db.user.update({
        where: { uid: user!.uid },
        data: { first_name, last_name, font_preference},
      });

      return json ({ success: "New settings saved" });
    } catch(error: any) {
      return json ({ error: error.message });
    }
  }

  if (actionType === "deleteAccount") {
    deleteUser(user!.uid);
    return json ({ success: "Account Deleted" });
  }
  return json ({ error: "Action error" });
};

export const loader: LoaderFunction = async ({ context, request }: { context: any, request: Request }) => {
  const user = await getUserSession(context, request);
  const db = getPrismaClient(context);

  if (!user) return json({ error: "Unauthenticated" }, { status: 401 });

  const [userData] = await Promise.all([
      db.user.findUnique({
          where: { uid: user!.uid }
      }),
  ]);

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
  const [endResponse, setEndResponse] = useState(true);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteButton, setDeleteButton] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

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
    
    // handle this client side instead of server side
    try {
      await sendResetPasswordEmail(user.email);
      // Show success message
      alert("Email sent! Check your inbox for the password reset link.");
      setEndResponse(false);
    } catch (error: any) {
      // Handle error
      console.error('Password reset error:', error);
    }
  }

  const handleDeleteAccount = () => {
    const formData = new FormData();

    formData.append("actionType", "deleteAccount")
    submit(formData, { method: "post" });
  }

  const previewText = (value: number | number[]) => {
    if (typeof value === "number") {
      setPreviewFont(value);
    }
  }

  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  const checkText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setDeleteInput(value);

    if (value === "DELETE") {
      setDeleteButton(true);
      setDeleteError(false);
    } else {
      setDeleteButton(false);
    }
  }

  const checkTextOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    
    if (value === "DELETE") {
      setDeleteButton(true);
      setDeleteError(false);
    } else {
      setDeleteError(true);
    }

  }

  return (
    <Page>
      <Page.Content style={{ display: "flex", justifyContent: "center"}}>
        <Card style={{ width: "550px"}}>
          <ResizableText h2>Settings</ResizableText>
          <Form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Grid.Container style={{ display: "flex", width: "100%", flexDirection: "column", gap: 16 }}>
              <Grid>
                <ResizableText h5>Edit Name</ResizableText>
                <Input
                  name="firstName"
                  htmlType="text"
                  placeholder="First Name"
                  initialValue={user.first_name}
                  width="100%" 
                  height={`${textScale * 2}px` }
                  font={`${textScale}px`}
                  clearable
                  required 
                  crossOrigin={undefined} 
                  onPointerEnterCapture={undefined} 
                  onPointerLeaveCapture={undefined} 
                />
                <Spacer h={1}/>
                <Input
                  name="lastName"
                  htmlType="text"
                  placeholder="Last Name"
                  initialValue={user.last_name}
                  width="100%" 
                  height={`${textScale * 2}px` }
                  font={`${textScale}px`}
                  clearable
                  required 
                  crossOrigin={undefined} 
                  onPointerEnterCapture={undefined} 
                  onPointerLeaveCapture={undefined} 
                />
              </Grid>

              <Grid>
                <ResizableText h5>Change Password</ResizableText>
                <ResizableText p>An email with instructions will be sent</ResizableText>
                <Button auto onClick={handleSendEmail} style={{ width: "100%", height:`${textScale}px * 2`, fontSize:`${textScale}px` }}
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                >
                  Reset password via Email
                </Button>
                {!endResponse && actionData?.error && <ResizableText type="error">{actionData.error}</ResizableText>}
                {!endResponse && actionData?.success && <ResizableText type="success">{actionData.success}</ResizableText>}
              </Grid>

              <Grid>
                <ResizableText h5>Change Text Size</ResizableText>
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
                  <ResizableText h3>Preview</ResizableText>
                  <Text>
                    This is a sample text. Adjust the slider above to change its size!
                  </Text>
                </Card>
              </Grid>
              <Button type="success" htmlType="submit" height={`${textScale * 2}px`} style={{ width: "100%", fontSize:`${textScale}px` }}
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
              >
                Save Settings
              </Button>
            </Grid.Container>
          </Form>
          {endResponse && actionData?.error && <ResizableText type="error">{actionData.error}</ResizableText>}
          {endResponse && actionData?.success && <ResizableText type="success">{actionData.success}</ResizableText>}
          <Spacer h={1}/>
          <Button auto onClick={openModal} type="error" ghost height={`${textScale * 2}px`} style={{ width: "100%", fontSize:`${textScale}px` }}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
          >
            Delete Account
          </Button>
          <Modal visible={modalState} onClose={closeModal}>
            <Modal.Title>Delete Account</Modal.Title>
            <Modal.Content>
              <Form>
                <ResizableText>To confirm, type <span style={{ fontWeight: "bold"}}>&quot;DELETE&quot;</span></ResizableText>
                <Input
                    name="delete"
                    htmlType="text"
                    placeholder="type here"
                    width="100%" 
                    height={`${textScale * 2}px` }
                    font={`${textScale}px`}
                    clearable
                    required
                    value={deleteInput}
                    onChange={checkText}
                    onBlur={checkTextOnBlur}
                    crossOrigin={undefined} 
                    onPointerEnterCapture={undefined} 
                    onPointerLeaveCapture={undefined}
                />
              </Form>
              {deleteError && <ResizableText style={{ color:"red" }}>type <span style={{ fontWeight: "bold"}}>&quot;DELETE&quot;</span> to enable delete button</ResizableText>}
              <ResizableText> <span style={{ color: "red", fontWeight: "bold" }}>Warning:</span> Account deletion is permanent and irreversible—once deleted, all data will be lost!</ResizableText>
            </Modal.Content>
            <Modal.Action passive onClick={() => setModalState(false)} style={{ fontSize:`${textScale}px` }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Cancel</Modal.Action>
            {!deleteButton && <Modal.Action style={{ backgroundColor: "grey", color: "white", fontSize:`${textScale}px` }} disabled placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Delete Account</Modal.Action>}
            {deleteButton && <Modal.Action style={{ backgroundColor: "red", color: "white", fontSize:`${textScale}px` }} onClick={handleDeleteAccount} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Delete Account</Modal.Action>}
          </Modal>
        </Card>
      </Page.Content>
    </Page>
  );
}