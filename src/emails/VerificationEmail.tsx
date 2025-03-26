import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  verificationLink: string;
  userName: string;
}

export const VerificationEmail = ({
  verificationLink,
  userName,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Vérifiez votre adresse email pour Mybingoo</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <img
              src="https://mybingoo.com/logo.png"
              alt="Mybingoo"
              width="150"
              height="50"
            />
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Bonjour {userName},</Text>
            <Text style={paragraph}>
              Merci de vous être inscrit sur Mybingoo. Pour activer votre compte,
              veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.
            </Text>
            <Button style={button} href={verificationLink}>
              Vérifier mon email
            </Button>
            <Text style={paragraph}>
              Si vous n&apos;avez pas créé de compte sur Mybingoo, vous pouvez ignorer cet email.
            </Text>
            <Text style={paragraph}>
              Ce lien expirera dans 24 heures.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '5px',
  margin: '0 auto',
  padding: '45px',
  maxWidth: '600px',
};

const logo = {
  marginBottom: '24px',
};

const content = {
  margin: '0 auto',
  maxWidth: '400px',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
};

export default VerificationEmail;
