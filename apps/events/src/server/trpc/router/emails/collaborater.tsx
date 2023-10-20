import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Hr,
  } from '@react-email/components';
  import * as React from 'react';
  
  interface CollaboratorInviteEmailProps {
    receiver_name?: string;
    sender_name?: string;
    resetPasswordLink?: string;
    event_name?: string;
    username?: string;
    receiver_photo?: string;
    invitedByUsername?: string;
    sender_email?: string;
    event_image?: string;
    invite_link?: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  
  export const CollaboratorInviteEmail = ({
    receiver_name = 'Invitee',
    receiver_photo = `${baseUrl}/static/vercel-user.png`,
    sender_email = 'bukinoshita@example.com',
    sender_name = 'Inviter',
    event_name = 'All White Party',
    event_image = `${baseUrl}/static/vercel-team.png`,
    invite_link = 'https://vercel.com/teams/invite/foo',
  
  }: CollaboratorInviteEmailProps) => {
    const previewText = `Join ${sender_name} in hosting the ${event_name} on Kazala!`;
    return (
      <Html>
        <Head>
          <Font
            fontFamily="Bricolage Grotesque"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://db.onlinewebfonts.com/t/102353a74d2e0700af3e11ef8a917b26.woff2',
              format: 'woff2',
            }}
            fontWeight={100}
            fontStyle="normal"
          />
        </Head>
        <Preview>{previewText}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img
              src={`https://existence-locate-shorts-dean.trycloudflare.com/static/favicon.png`} 
              width="40"
              height="40"
              alt="Kazala Logo"
            />
            <Section>
              <Text style={text}>Hi {receiver_name},</Text>
  
              <Text style={text}>
                <strong>{sender_name}</strong> (
                <Link
                  href={`mailto:${sender_email}`}
                  style={anchor}
                >
                  {sender_email}
                </Link>
                ) has requested for you to become a collaborator for the <strong>{event_name}</strong> event on{' '}
                <strong>Kazala</strong>.
              </Text>
  
  
              <Section>
                <Row>
                  <Column align="right">
                    <Img className="rounded-full" src={receiver_photo} width="64" height="64" />
                  </Column>
                  <Column align="center">
                    <Img
                      src={`${baseUrl}/static/vercel-arrow.png`}
                      width="12"
                      height="9"
                      alt="invited you to"
                    />
                  </Column>
                  <Column align="left">
                    <Img className="rounded-full" src={event_image} width="64" height="64" />
                  </Column>
                </Row>
              </Section>
              <Section style = {{alignItems: "center"}}>
                <Button
                  pX={20}
                  pY={12}
                  style = {button}
                  href={invite_link}
                >
                  Join the team
                </Button>
              </Section>
              <Text style={text}>
                or copy and paste this URL into your browser:{' '}
                <Link
                  href={invite_link}
                  style={anchor}
                >
                  {invite_link}
                </Link>
              </Text>
              <Text style={text}>Enjoy the Event!</Text>
  
  
              <Hr style={hr}/>
              <Text style={text}>
                This invitation was intended for{' '}
                <span className="text-black">{receiver_name} </span>. If you were not
                expecting this invitation, you can ignore this email. If you are
                concerned about your account&apos;s safety, please reply to this email to
                get in touch with us.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default CollaboratorInviteEmail;
  
  const main = {
    backgroundColor: "#f0ece9",
    margin: "0 auto",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    padding: '10px 0',
    // "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  
  };
  
  const container = {
    backgroundColor: "#eee5dd",
    maxWidth: "36rem",
    marginTop: "3rem", 
    marginLeft: "auto", 
    marginRight: "auto",
    padding: "2rem",   
    borderRadius: "0.5rem", 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"  
  };
  
  const text = {
    fontSize: '16px',
    color: '#404040',
    lineHeight: '26px',
  };
  
  const button = {
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '180px',
    borderRadius: '8px',
    backgroundColor: '#8c0327',
    color: '#f0ece9',
    fontSize: '12px',
  };
  
  const anchor = {
    textDecoration: 'underline',
    color: '#8c0327',
  };
  
  const Font = ({ 
    webFont = {url: "", format: ""},
    fontStyle = 'normal',
    fontFamily = "",
    fontWeight = 400,
    fallbackFontFamily = "",
  }) => {
    const src = webFont ? `src: url(${webFont.url}) format(${webFont.format});` : "";
  
    return (
        <style>
        {
            `
            @font-face {
                font-style: ${fontStyle};
                font-family: ${fontFamily};
                font-weight: ${fontWeight};
                mso-font-alt: ${Array.isArray(fallbackFontFamily) ? fallbackFontFamily[0] : fallbackFontFamily};
                ${src}
            }
  
            * {
                font-family: ${fontFamily}, ${Array.isArray(fallbackFontFamily) ? fallbackFontFamily.join(", ") : fallbackFontFamily};
            }
            `
        }
        </style>
    )
  };
  
  const hr = {
    borderColor: '#8c0327',
    margin: '20px 0',
  };
  