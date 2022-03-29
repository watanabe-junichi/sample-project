
export const mailConfig = {
    subject: {
      user: 'Thank you Download.',
      verification: 'Password Reset.',
    },
    body: {
        user: 'Thank you Application Download.{username}{####}',
        verification: 'Please Password Confirmed.{####}',
    },
    EmailConfiguration: {
        dev: {
            EmailSendingAccount: 'COGNITO_DEFAULT'
        },
        stg: {
        },
        prod: {
          EmailSendingAccount: 'DEVELOPER',
          From: 'wjyunichi@gmail.com',
          ReplyToEmailAddress: 'wjyunichi+reply@gmail.com'
        }
    }
}
