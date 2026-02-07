import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AnnouncementEmailProps {
  title: string;
  content: string;
  teamName: string;
  memberName?: string;
}

export function AnnouncementEmail({
  title,
  content,
  teamName,
  memberName,
}: AnnouncementEmailProps) {
  const previewText = `${title} - ${teamName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>

          {memberName && <Text style={greeting}>Hi {memberName},</Text>}

          <Section style={contentSection}>
            <Text style={text}>{content}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              This announcement was sent by {teamName}
            </Text>
            <Text style={footerText}>
              <Link href="#" style={link}>
                Unsubscribe from team announcements
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
};

const greeting = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 40px",
  marginBottom: "20px",
};

const contentSection = {
  padding: "0 40px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  borderTop: "1px solid #eaeaea",
  marginTop: "32px",
  padding: "20px 40px",
};

const footerText = {
  color: "#666",
  fontSize: "12px",
  lineHeight: "16px",
};

const link = {
  color: "#0066cc",
  textDecoration: "underline",
};
