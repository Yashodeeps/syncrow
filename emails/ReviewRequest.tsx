import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface ReviewRequestProps {
  name: string;
  link: string;
}

export default function ReviewRequest({ name, link }: ReviewRequestProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Review Request</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        {name} has requested a review from you for his services.
      </Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello,</Heading>
        </Row>
        <Row>
          <Text>Click the link below to drop a review. </Text>
        </Row>
        <Row>
          <Text>{link}</Text>
        </Row>
        <Row>
          <Text>Ignore this email if you do not want to drop a review. </Text>
        </Row>
      </Section>
    </Html>
  );
}
