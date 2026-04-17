export const templates = [
    {
        name: 'verify-email',
        subject: 'Verify your email address',
        senderEmail: 'noreply@dndmapp.nl.eu.org',
        variables: ['username', 'verificationLink'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Verify your email address</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Verify your email address</h1>
            <p>Hi {{username}},</p>
            <p>Please verify your email address by clicking the button below.</p>
            <p style="text-align: center">
                <a
                    href="{{verificationLink}}"
                    style="
                        background: #7b2d8b;
                        color: #fff;
                        padding: 12px 24px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-block;
                    "
                >
                    Verify Email Address
                </a>
            </p>
            <p style="color: #666; font-size: 0.875rem">
                If you did not create an account, you can safely ignore this email.
            </p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'welcome',
        subject: 'Welcome to D&D Mapp',
        senderEmail: 'info@dndmapp.nl.eu.org',
        variables: ['username'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Welcome to D&amp;D Mapp</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Welcome to D&amp;D Mapp!</h1>
            <p>Hi {{username}},</p>
            <p>Your account is ready. Start planning your campaigns today.</p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'request-change-email',
        subject: 'Confirm your new email address',
        senderEmail: 'noreply@dndmapp.nl.eu.org',
        variables: ['username', 'confirmationLink'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Confirm your new email address</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Confirm your new email address</h1>
            <p>Hi {{username}},</p>
            <p>
                We received a request to change the email address on your D&amp;D Mapp account to this address. Click
                the button below to confirm.
            </p>
            <p style="text-align: center">
                <a
                    href="{{confirmationLink}}"
                    style="
                        background: #7b2d8b;
                        color: #fff;
                        padding: 12px 24px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-block;
                    "
                >
                    Confirm New Email Address
                </a>
            </p>
            <p style="color: #666; font-size: 0.875rem">
                If you did not request this change, you can safely ignore this email.
            </p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'notify-change-email-request',
        subject: 'Email address change requested',
        senderEmail: 'security@dndmapp.nl.eu.org',
        variables: ['username'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Email address change requested</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Email address change requested</h1>
            <p>Hi {{username}},</p>
            <p>
                A request was made to change the email address on your D&amp;D Mapp account. A confirmation email has
                been sent to the new address.
            </p>
            <p style="color: #666; font-size: 0.875rem">
                If you did not request this change, please contact support immediately.
            </p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'request-change-password',
        subject: 'Reset your password',
        senderEmail: 'security@dndmapp.nl.eu.org',
        variables: ['username', 'resetLink'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Reset your password</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Reset your password</h1>
            <p>Hi {{username}},</p>
            <p>
                We received a request to reset the password for your D&amp;D Mapp account. Click the button below to
                set a new password.
            </p>
            <p style="text-align: center">
                <a
                    href="{{resetLink}}"
                    style="
                        background: #7b2d8b;
                        color: #fff;
                        padding: 12px 24px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-block;
                    "
                >
                    Reset Password
                </a>
            </p>
            <p style="color: #666; font-size: 0.875rem">
                This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
            </p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'confirm-password-change',
        subject: 'Your password has been changed',
        senderEmail: 'security@dndmapp.nl.eu.org',
        variables: ['username'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Your password has been changed</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Your password has been changed</h1>
            <p>Hi {{username}},</p>
            <p>The password for your D&amp;D Mapp account was successfully changed.</p>
            <p style="color: #666; font-size: 0.875rem">
                If you did not make this change, please contact support immediately.
            </p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'request-account-deletion',
        subject: 'Confirm your account deletion request',
        senderEmail: 'accounts@dndmapp.nl.eu.org',
        variables: ['username', 'confirmationLink'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Confirm your account deletion request</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Confirm your account deletion request</h1>
            <p>Hi {{username}},</p>
            <p>
                We received a request to permanently delete your D&amp;D Mapp account. Click the button below to
                confirm. <strong>This action cannot be undone.</strong>
            </p>
            <p style="text-align: center">
                <a
                    href="{{confirmationLink}}"
                    style="
                        background: #c0392b;
                        color: #fff;
                        padding: 12px 24px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-block;
                    "
                >
                    Confirm Account Deletion
                </a>
            </p>
            <p style="color: #666; font-size: 0.875rem">
                If you did not request account deletion, you can safely ignore this email.
            </p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'confirm-account-deletion',
        subject: 'Your D&D Mapp account has been deleted',
        senderEmail: 'accounts@dndmapp.nl.eu.org',
        variables: ['username'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Your D&amp;D Mapp account has been deleted</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">Your account has been deleted</h1>
            <p>Hi {{username}},</p>
            <p>Your D&amp;D Mapp account has been permanently deleted. All your data has been removed.</p>
            <p>We're sorry to see you go. If you ever change your mind, you're always welcome to create a new account.</p>
        </div>
    </body>
</html>`,
    },
    {
        name: 'invite-to-campaign',
        subject: "You've been invited to a D&D Mapp campaign",
        senderEmail: 'info@dndmapp.nl.eu.org',
        variables: ['inviterName', 'campaignName', 'inviteLink'],
        content: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Campaign Invitation</title>
    </head>
    <body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 0">
        <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 40px">
            <h1 style="color: #1a1a2e">You've been invited!</h1>
            <p>
                <strong>{{inviterName}}</strong> has invited you to join the campaign
                <strong>{{campaignName}}</strong> on D&amp;D Mapp.
            </p>
            <p style="text-align: center">
                <a
                    href="{{inviteLink}}"
                    style="
                        background: #7b2d8b;
                        color: #fff;
                        padding: 12px 24px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-block;
                    "
                >
                    Accept Invitation
                </a>
            </p>
            <p style="color: #666; font-size: 0.875rem">
                If you were not expecting this invitation, you can safely ignore this email.
            </p>
        </div>
    </body>
</html>`,
    },
];
