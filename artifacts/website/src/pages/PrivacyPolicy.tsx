import { useSEO } from "@/hooks/useSEO";

export default function PrivacyPolicy() {
  useSEO({ title: "Privacy Policy — Tether", description: "Tether's privacy policy. Learn how we collect, use, and protect your personal information and your child's data." });

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-[#2C3E50] to-[#3d5166] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/80">Last Updated: March 27, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-gray max-w-none">

          <h2>1. Introduction</h2>
          <p>
            Tether App, Inc. ("Tether," "we," "us," or "our") is committed to protecting the privacy of our users, especially children. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our mobile application, website (tetherapp.app), and related services (collectively, the "Service").
          </p>
          <p>
            By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use the Service.
          </p>

          <h2>2. Children's Privacy (COPPA Compliance)</h2>
          <p>
            Tether is designed for use by children ages 7–13 under parental supervision. We comply with the Children's Online Privacy Protection Act (COPPA) and take the following measures:
          </p>
          <ul>
            <li><strong>Parental Consent Required:</strong> A parent or legal guardian must create an account and provide verifiable parental consent before a child can use the Service.</li>
            <li><strong>Minimal Data Collection:</strong> We collect only the minimum information necessary to provide the Service to children. We do not collect more personal information from children than is reasonably necessary.</li>
            <li><strong>No Behavioral Advertising:</strong> We do not serve behavioral or targeted advertising to children. Tether contains no advertisements.</li>
            <li><strong>Parental Access and Control:</strong> Parents can review, update, or delete their child's personal information at any time by contacting us at <a href="mailto:hello@tetherapp.app">hello@tetherapp.app</a> or through the parent dashboard in the app.</li>
            <li><strong>Data Retention:</strong> We retain children's data only as long as the account is active. Parents may request deletion at any time.</li>
          </ul>

          <h2>3. Information We Collect</h2>
          <h3>3.1 Information You Provide</h3>
          <ul>
            <li><strong>Parent Account Information:</strong> Name, email address, phone number, and payment information when you create an account or subscribe to the Service.</li>
            <li><strong>Child Profile Information:</strong> First name (or nickname), age/date of birth, and profile preferences as provided by the parent.</li>
            <li><strong>Messages and Content:</strong> Messages, images, and other content sent through the Service. This content is processed by our safety systems but is only visible to the child, their approved contacts, and their parent/guardian.</li>
            <li><strong>Waitlist Information:</strong> Name, email address, and role (parent, educator, etc.) when you join our waitlist.</li>
          </ul>

          <h3>3.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Device Information:</strong> Device type, operating system, and app version.</li>
            <li><strong>Usage Data:</strong> Session duration, features used, and interaction patterns (collected in aggregate, not individually identifiable for children).</li>
            <li><strong>Log Data:</strong> IP address, browser type, and access times for website visitors.</li>
          </ul>

          <h3>3.3 Information We Do NOT Collect</h3>
          <ul>
            <li>We do not collect precise geolocation data from children.</li>
            <li>We do not collect biometric data.</li>
            <li>We do not collect data from third-party sources about children.</li>
            <li>We do not use cookies or tracking technologies to profile children.</li>
          </ul>

          <h2>4. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service.</li>
            <li>Process transactions and send related information (e.g., purchase confirmations, subscription updates).</li>
            <li>Send parents safety alerts and notifications about their child's messaging activity via SMS and/or push notifications.</li>
            <li>Monitor content for safety using automated systems to detect harmful, inappropriate, or dangerous content.</li>
            <li>Enforce our Terms of Service and protect the safety of our users.</li>
            <li>Communicate with parents about service updates, new features, and promotional offers (with opt-out available).</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2>5. SMS/Text Message Communications</h2>
          <p>
            If you provide your phone number and consent to receive SMS notifications, we may send you text messages related to:
          </p>
          <ul>
            <li>Safety alerts about your child's messaging activity (e.g., harmful content detection, trust level changes).</li>
            <li>Account security notifications (e.g., login verification).</li>
            <li>Service updates and community notifications.</li>
          </ul>
          <p>
            <strong>Message Frequency:</strong> Message frequency varies based on your child's activity and account settings. Safety alerts are sent in real-time when triggered.
          </p>
          <p>
            <strong>Message and Data Rates:</strong> Standard message and data rates may apply depending on your mobile carrier and plan.
          </p>
          <p>
            <strong>Opt-Out:</strong> You may opt out of SMS notifications at any time by replying <strong>STOP</strong> to any message or by updating your notification preferences in the Tether parent dashboard. Reply <strong>HELP</strong> for assistance. Opting out of SMS does not affect safety alerts delivered through push notifications or the app.
          </p>
          <p>
            <strong>Consent:</strong> By providing your phone number during account registration and enabling SMS notifications, you expressly consent to receive text messages from Tether at the number provided. Consent is not a condition of purchase.
          </p>

          <h2>6. How We Share Your Information</h2>
          <p><strong>We do not sell personal identifiable information (PII) to third parties. Ever.</strong></p>
          <p>We may share information only in the following limited circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We use trusted third-party service providers to help operate the Service (e.g., cloud hosting, payment processing, SMS delivery). These providers are contractually required to protect your information and may only use it to perform services on our behalf.</li>
            <li><strong>Safety and Legal Requirements:</strong> We may disclose information if required by law, regulation, legal process, or governmental request, or to protect the safety of any person, prevent fraud, or address security issues.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction. We will provide notice before personal information is transferred and becomes subject to a different privacy policy.</li>
          </ul>
          <p>
            <strong>Not even Tether's creators can see your child's message content.</strong> Our dual-layer PII architecture ensures that message content is processed by automated safety systems but is not accessible to Tether employees in readable form.
          </p>

          <h2>7. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul>
            <li>Encryption of data in transit (TLS/SSL) and at rest.</li>
            <li>Role-based access controls and authentication.</li>
            <li>Regular security audits and vulnerability assessments.</li>
            <li>Secure cloud infrastructure with SOC 2 compliant providers.</li>
          </ul>
          <p>
            While we strive to use commercially acceptable means to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>

          <h2>8. Data Retention</h2>
          <p>
            We retain personal information for as long as your account is active or as needed to provide the Service. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required by law to retain it.
          </p>

          <h2>9. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access, correct, or delete your personal information.</li>
            <li>Object to or restrict certain processing of your information.</li>
            <li>Request portability of your information.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at <a href="mailto:hello@tetherapp.app">hello@tetherapp.app</a>. We will respond to requests within 30 days.
          </p>

          <h2>10. California Privacy Rights (CCPA)</h2>
          <p>
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including:
          </p>
          <ul>
            <li>The right to know what personal information we collect, use, and disclose.</li>
            <li>The right to request deletion of your personal information.</li>
            <li>The right to opt out of the sale of personal information. Note: We do not sell personal information.</li>
            <li>The right to non-discrimination for exercising your privacy rights.</li>
          </ul>

          <h2>11. Third-Party Services</h2>
          <p>
            The Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you access.
          </p>

          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For material changes affecting children's data, we will obtain new parental consent as required by COPPA. We encourage you to review this Privacy Policy periodically.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:hello@tetherapp.app">hello@tetherapp.app</a></li>
            <li><strong>Website:</strong> <a href="https://tetherapp.app">https://tetherapp.app</a></li>
            <li><strong>Company:</strong> Tether App, Inc.</li>
          </ul>

        </div>
      </section>
    </div>
  );
}
