import { Button, Card, Image, Input, Text } from '@geist-ui/react';
import { Form, useNavigate } from "@remix-run/react";
import { sendResetPasswordEmail } from "~/auth.client";
import AuthenticatedLink from '~/components/AuthenticatedLink';


// firebase auth is handled client-side and not server-side

export default function ForgotPassword() {
  //const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  const handleSendEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;

    if (!email) {
      // Handle empty email input
      alert("Please enter an email address.");
      return;
    }
  
    try {
      
      await sendResetPasswordEmail(email);
      // Show success message
      alert("Email sent! Check your inbox for the password reset link.");
      // Navigate to login page after showing the alert
      navigate("/login");
    } catch (error: any) {
      // Handle error
      console.error('Password reset error:', error);
    }
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "100vh"
    }} >
      <Image width="400px" style={{ textAlign: "center", paddingBottom: 30 }} src="logo.png" />
      <Card width="400px" style={{ padding: 10 }}>
        <Text h3>Forgot Password</Text>
        <Text p>You will receive an email with instructions to reset your password if it exists in our system. You will be redirected to the login page after submitting.</Text>
        <Text h6>Email</Text>
        <Form onSubmit={handleSendEmail} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input name="email" htmlType="email" clearable placeholder="Enter your Email" required width="100%" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <Button 
            htmlType="submit" 
            type="secondary"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Submit Email
          </Button>
        </Form>
        {/*actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>*/}
        {/*actionData?.success && <p style={{ color: "green" }}>{actionData.success}</p>*/}
        <AuthenticatedLink to="/login" prefetch='render'>
          <Text p>Back to Sign in</Text>
        </AuthenticatedLink>
      </Card>
    </div>
  );
}