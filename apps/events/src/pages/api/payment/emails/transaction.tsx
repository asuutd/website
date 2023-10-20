import { env } from '@/env/server.mjs';
import {
  Html,
  Body,
  Container,
  Text,
  Button,
  Img,
  Heading,
  Head,
  Preview,
  Link,
  Tailwind,
  Hr,
  Row,
  Column,
  Section
} from '@react-email/components';
import { CSSProperties } from 'react';

const baseUrl = env.NEXT_PUBLIC_URL

// {QR_code}, {not right now;order_number}}

interface purchaseEmailProps {
  user_name: string;
  event_name: string;
  event_photo: string;
  order_date: string;
  tiers: {tierName: string; quantity: number; tierId: string; tierPrice: number}[];

}

export const PurchaseEmail = ({user_name = "Buyer Buyerton",  
                               event_name = "All White Party", 
                               event_photo = "https://ucarecdn.com/45048ba5-accf-4379-a0a9-320b011ec681/", 
                               order_date = "July 26, 2019", 
                               tiers = [{tierName: "General Sale", tierId: "", quantity: 1, tierPrice: 12}]}: purchaseEmailProps) => { 

  const totalPrice = tiers.reduce((sum, tier) => sum + tier.tierPrice, 0);
  const firstName = user_name.split(' ')[0];
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
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Preview>You&apos;ve now made a transaction with Kazala!</Preview>       
          <Body style={main}>
            {/* HEADER */}
            <Container>
                    <Img 
                      src={`${baseUrl}/static/favicon.png`} 
                      alt="Kazala Logo" 
                      width="64"
                      height="64" 
                      style={logo}
                    />

                    <Text style={headerText}>{firstName}, </Text>
                    <Text style={headerText} >your tickets are in!</Text>

            </Container>

            {/* BODY */}
            <Container style={bodyContainer}>

              {/* KAZALA MESSAGE BODY TOP */}
              <Section style={messageSection}>
                <Row>
                  <Heading style={messageText}>Thank you for your purchase!</Heading>
                  <Text style={messageText}>
                      {/* className="text-xl"> */}
                      Kazala links you to campus activities and organization-hosted gatherings, enabling you to explore and engage in what matters most to you.
                    </Text>
                </Row>

                <Row className='mt-10 space-x-4'>
                  <Button 
                    href="https://kazala.co/"
                    pX={12}
                    pY={12}
                    style={{ ...button, backgroundColor: '#8c0327', color: '#f0ece9' }}
                  >
                    VISIT KAZALA
                  </Button>

                  <Button 
                    href="https://kazala.co/tickets"
                    pX={12}
                    pY={12}
                    style={{ ...button, backgroundColor: '#f0ece9', color: '#2e2e2e' }}
                  >
                    GO TO MY TICKETS
                  </Button>
                </Row>
                  
              </Section>              
              
              {/* TICKET DISPLAY BODY MIDDLD */}
              <Section>
                  {/* <Img
                    src={`${baseUrl}/static/ticket-100.png`} 
                    alt="ticket border"
                    width="300"
                    height="300"
                  >
                  </Img> */}
                  <Img 
                    src={`${baseUrl}/static/placeholder-square.png`} 
                    alt="QR CODE HERE" 
                    width="150"
                    height="150"
                    style={{ 
                      ...QR_Img, 
                      // position: 'absolute', 
                      // transform: 'translate(0px, -200px)' 
                    }}
          
                  />
              </Section>


              {/* ORDER INFORMATION BODY BOTTOM */}
              <Section>
                <Heading 
                  style={{ marginBottom: '4px', marginTop: '50px', fontSize: 'x-large', fontWeight: 'bold', color: '#2e2e2e',}}
                >
                  Order Summary
                </Heading>
                <Hr style={hr} />

                {tiers.map(tier => 
                  <Section  key ={tier.tierId}>
                    <Column style={{ width: '64px' }}>
                      <Img
                        src={event_photo}
                        width="64"
                        height="64"
                        alt="Event Photo"
                        style={productIcon}
                      />
                    </Column>

                    <Column style={productDescriptionWrapper}>
                      <Text style={productTitle}>{event_name}</Text>
                      <Text style={productDescription}>{tier.tierName}</Text>
                      <Text style={productDescription}>Purchased {order_date}</Text>
                    </Column>
                    
                    <Column style={productQuantityWrappper} >
                      <Text style={productQuantity}>{tier.quantity}x</Text>
                    </Column>

                    <Column style={productPriceWrapper} align="right">
                      <Text style={productPrice}>${tier.tierPrice.toFixed(2)}</Text>
                    </Column>
                  </Section>
                )}

                  {/* TOTAL */}
   
                <Row>
                  <Column align="right">
                    <Column style={tableCell} align="right">
                      <Text style={productPriceTotal}>TOTAL</Text>
                    </Column>
                    <Column style={productPriceLargeWrapper}>
                      <Text style={productPriceLarge}>${totalPrice.toFixed(2)}</Text>
                    </Column>
                  </Column>
                </Row>
                

              </Section>

            </Container>

  
            {/* FOOTER */}
            <Container style = {footerContainer}>
              <Section>
                  {/* COME ADD FUNCTIONALITIY */}
                {/* <Row style={{ textAlign: "center", paddingBottom: "8px" }}>
                
                  <Heading style={{ fontSize: "xl", fontWeight: "bold", marginBottom: "4px" }}>Upcoming Events</Heading>
                  <Column><Text>Event photo 1</Text></Column>
                  <Column><Text>Event photo 2</Text></Column>
                  <Column><Text>Event photo 3</Text></Column>
                </Row> */}

                <Column >
                  <Column style={{...tableCell, paddingBottom: '30px'}} align="left">
                    <Button 
                      href="https://kazala.co/#events"
                      pX={12}
                      pY={12}
                      style={{ ...button, backgroundColor: '#8c0327', color: '#f0ece9'}}
                    >
                        UPCOMING EVENTS
                    </Button>
                  </Column>

                  <Column style={tableCell} align='right'>
                    <Link 
                      href="https://kazala.co/register"
                      style={links}
                    > 
                      <Text style={{color: '#8c0327'}}>Run an Event?</Text>
                    </Link>
                  </Column>
                </Column>
              </Section>    
  
              <Section style={{textAlign:"center"}}>
                <Row>
                <Heading style={{fontSize: "1.25rem", fontWeight: "bold", marginBottom: "4px", color: '#2e2e2e'}}>Kazala</Heading>
                <Text style={{color :"#8c0327", marginBottom: "4"}}>SOCIAL</Text>
                </Row>

                
                {/* ASU links stuff */}
                <Row>
                  <Column>
                    <Link href="https://twitter.com/utdallasasu" style={links}>
                      <Img
                        src={`${baseUrl}/static/twitterx-50.png`} 
                        width="24"
                        height="24"
                        alt="twitter logo"
                      >
                      </Img>
                    </Link>
                  </Column>

                  <Column>
                    <Link href="https://www.instagram.com/utdallasasu" style={links}>
                      <Img
                      src={`${baseUrl}/static/instagram-32.png`} 
                        width="24"
                        height="24"
                        alt="instagram logo"
                      >
                      </Img>
                    </Link>
                  </Column>

                  <Column>
                    <Link href="https://www.tiktok.com/@utdallasasu" style={links}>
                      <Img
                        width="24"
                        height="24"
                        alt="tiktok logo"
                        src={`${baseUrl}/static/tiktok-32.png`} 
                      >
                      </Img>
                    </Link>
                  </Column>
                </Row>
              </Section>

            </Container>
          </Body>
      </Tailwind>
    </Html>
  )
}

export default PurchaseEmail;

const logo = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const headerText: CSSProperties = {
  textAlign: 'center',
  color: '#2e2e2e',
  fontSize: '1.875rem',
  fontWeight: 'bold',
  marginBottom: '8px', 
};

const messageSection: CSSProperties = {
  textAlign: 'center',
}

const messageText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#2e2e2e',
  marginBottom: '8px',
}

const button = {
  // backgroundColor: '#5F51E8',
  borderRadius: '8px',
  // color: '#fff',
  fontSize: '12px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const hr = {
  borderColor: '#8c0327',
  margin: '20px 0',
};

const main = {
  backgroundColor: "#f0ece9",
  margin: "0 auto",
  fontFamily:
    "'Bricolage Grotesque', sans-serif",
};

const bodyContainer = {
  backgroundColor: "#eee5dd",
  maxWidth: "36rem",
  marginTop: "3rem", 
  marginLeft: "auto", 
  marginRight: "auto",
  padding: "2rem",   
  borderRadius: "0.5rem", 
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"  
};

const footerContainer: CSSProperties = {
  padding: "2rem",
  maxWidth: "36rem",
  marginTop: "2rem",
  // marginBottom: "rem",
  marginLeft: "auto", 
  marginRight: "auto",
  textAlign: "center",
  alignItems: 'center',
  justifyContent: 'center',
}

const QR_Img = {
  margin: '0 auto',
  padding: '40px 20px 20px',
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

const resetText = {
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
};

const tableCell = { 
  display: 'table-cell' 
};

const productIcon = {
  margin: '0 0 0 20px',
  borderRadius: '14px',
  border: '1px solid rgba(128,128,128,0.2)',
};

const productTitle = { 
  fontSize: '12px', 
  fontWeight: '600',  
  color: '#2e2e2e', 
  ...resetText, 
};

const productQuantity = {
  color: '#2e2e2e',
  fontSize: '12px', 
  fontWeight: '600', 
  ...resetText,
};

const productDescription = {
  fontSize: '12px',
  color: 'rgb(102,102,102)',
  ...resetText,
};

const productPriceTotal = {
  margin: '0',
  color: '2e2e2e',
  fontSize: '10px',
  fontWeight: '600',
  padding: '0px 30px 0px 0px',
  textAlign: 'right' as const,
};

const productPrice = {
  color: '#2e2e2e',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
};

const productPriceLarge = {
  margin: '0px 20px 0px 0px',
  fontSize: '16px',
  color: '2e2e2e',
  fontWeight: '600',
  whiteSpace: 'nowrap' as const,
  textAlign: 'right' as const,
};

const productPriceWrapper = {
  display: 'table-cell',
  padding: '0px 20px 0px 0px',
  width: '100px',
  verticalAlign: 'top'

};

const productDescriptionWrapper = {
  paddingLeft: '22px',
  verticalAlign: 'top'
};

const productQuantityWrappper = {
  verticalAlign: 'top',
  display: 'table-cell',
  padding: '0px 0px 0px 0px',
  width: '50px',
};

const productPriceLargeWrapper = { 
  display: 'table-cell',
  width: '90px' 
};

const links = {
  textDecoration: 'none', 
  cursor: 'pointer', 
  display: 'inline-block',
  marginBottom: "2rem",
};