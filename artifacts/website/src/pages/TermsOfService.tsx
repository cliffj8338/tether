import { useSEO } from "@/hooks/useSEO";

export default function TermsOfService() {
  useSEO({ title: "Terms of Service — Tether", description: "Tether's terms of service. Read the terms and conditions governing your use of the Tether messaging platform." });

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-[#2C3E50] to-[#3d5166] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Terms of Service</h1>
          <p className="text-white/80">Last Updated: March 27, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-gray max-w-none">

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Tether mobile application, website (tetherapp.app), and related services (collectively, the "Service") operated by Tether App, Inc. ("Tether," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
          </p>
          <p>
            If you are a parent or legal guardian creating an account on behalf of a child, you represent that you have the legal authority to agree to these Terms on their behalf.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Tether is a supervised messaging platform designed for children ages 7–13. The Service provides:
          </p>
          <ul>
            <li>A controlled messaging environment with parental oversight.</li>
            <li>A graduated trust system that expands communication privileges as children demonstrate responsible use.</li>
            <li>Automated content safety monitoring to detect harmful, inappropriate, or dangerous content.</li>
            <li>Parent dashboard and notifications, including SMS alerts for safety events.</li>
            <li>Faith Mode, an optional feature that integrates Christian values into the communication experience.</li>
            <li>Anti-addiction controls to promote healthy digital habits.</li>
          </ul>

          <h2>3. Eligibility</h2>
          <ul>
            <li><strong>Parents/Guardians:</strong> You must be at least 18 years old and a legal parent or guardian to create an account.</li>
            <li><strong>Children:</strong> Children ages 7–13 may use the Service only with a parent-created account and active parental supervision through the Service.</li>
            <li>Tether is currently available in the United States. Additional regions will be supported in the future.</li>
          </ul>

          <h2>4. Account Registration</h2>
          <p>
            To use the Service, a parent or legal guardian must:
          </p>
          <ul>
            <li>Create an account and provide accurate, complete information.</li>
            <li>Provide verifiable parental consent for any child accounts.</li>
            <li>Maintain the security of account credentials.</li>
            <li>Notify us immediately of any unauthorized use of the account.</li>
          </ul>
          <p>
            You are responsible for all activity that occurs under your account.
          </p>

          <h2>5. SMS Messaging Terms</h2>
          <p>
            <strong>Program Name:</strong> Tether Parental Notifications
          </p>
          <p>
            <strong>Program Description:</strong> Tether sends SMS notifications to parents and guardians to alert them about their child's messaging activity, including safety alerts, trust level changes, and service updates.
          </p>
          <p>
            <strong>Message Frequency:</strong> Message frequency varies. Safety alerts are sent in real-time when triggered by the content monitoring system. You may also receive periodic service updates and community notifications.
          </p>
          <p>
            <strong>Message and Data Rates:</strong> Standard message and data rates may apply. Contact your mobile carrier for details about your plan.
          </p>
          <p>
            <strong>Opt-In:</strong> By providing your phone number during account registration and enabling SMS notifications, you expressly consent to receive text messages from Tether. Consent to receive SMS messages is not a condition of purchasing any goods or services.
          </p>
          <p>
            <strong>Opt-Out:</strong> You may opt out of SMS notifications at any time by texting <strong>STOP</strong> to any Tether message. You will receive a confirmation message and no further SMS messages will be sent unless you re-subscribe. You may also manage your SMS preferences in the Tether parent dashboard.
          </p>
          <p>
            <strong>Help:</strong> For help with SMS messaging, text <strong>HELP</strong> to any Tether message, or contact us at <a href="mailto:hello@tetherapp.app">hello@tetherapp.app</a>.
          </p>
          <p>
            <strong>Supported Carriers:</strong> Tether SMS is supported on all major U.S. carriers, including AT&T, Verizon, T-Mobile, Sprint, and others. Carriers are not liable for delayed or undelivered messages.
          </p>

          <h2>6. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable law, regulation, or these Terms.</li>
            <li>Harass, bully, threaten, or intimidate any other user.</li>
            <li>Send content that is illegal, harmful, abusive, obscene, or otherwise objectionable.</li>
            <li>Attempt to circumvent safety features, content filters, or parental controls.</li>
            <li>Impersonate any person or entity.</li>
            <li>Transmit malware, viruses, or other harmful code.</li>
            <li>Use automated systems (bots, scrapers) to access the Service.</li>
            <li>Collect personal information of other users without consent.</li>
          </ul>

          <h2>7. Content and Safety Monitoring</h2>
          <p>
            Tether uses automated systems to monitor messages and content for safety purposes. By using the Service, you acknowledge and agree that:
          </p>
          <ul>
            <li>Messages may be analyzed by automated safety systems to detect harmful content.</li>
            <li>Parents/guardians may view their child's messages and activity through the parent dashboard.</li>
            <li>Tether may take action on content that violates our Community Guidelines, including blocking messages, issuing warnings, or suspending accounts.</li>
            <li>In cases of imminent danger or suspected child abuse, Tether may report information to law enforcement as required by law.</li>
          </ul>

          <h2>8. Subscription and Payment</h2>
          <ul>
            <li>Tether operates on a subscription basis. Pricing details are available at <a href="https://tetherapp.app/pricing">tetherapp.app/pricing</a>.</li>
            <li>Subscriptions automatically renew unless cancelled before the renewal date.</li>
            <li>Refunds are handled in accordance with the policies of the app store through which you subscribed (Apple App Store or Google Play Store).</li>
            <li>We reserve the right to change pricing with 30 days' notice.</li>
          </ul>

          <h2>9. Intellectual Property</h2>
          <p>
            The Service, including all software, design, text, graphics, logos, and other content, is owned by Tether App, Inc. and is protected by United States and international intellectual property laws. You may not copy, modify, distribute, or create derivative works of the Service without our prior written consent.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may suspend or terminate your account at any time if you violate these Terms or if we determine that your use of the Service poses a safety risk. You may delete your account at any time through the app or by contacting us. Upon termination:
          </p>
          <ul>
            <li>Your right to use the Service will immediately cease.</li>
            <li>We will delete your personal information in accordance with our Privacy Policy.</li>
            <li>Provisions that by their nature should survive termination will survive (including limitations of liability and dispute resolution).</li>
          </ul>

          <h2>11. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            While Tether uses automated systems to monitor content for safety, we do not guarantee that all harmful content will be detected or prevented. Parents and guardians remain responsible for supervising their children's online activity.
          </p>

          <h2>12. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TETHER APP, INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
          </p>
          <p>
            OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRIOR TO THE CLAIM.
          </p>

          <h2>13. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Tether App, Inc. and its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or expenses (including attorney's fees) arising from your use of the Service or violation of these Terms.
          </p>

          <h2>14. Dispute Resolution</h2>
          <p>
            Any disputes arising from these Terms or the Service will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration will be conducted in the State of Pennsylvania. You agree to waive any right to a jury trial or to participate in a class action.
          </p>

          <h2>15. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Pennsylvania, United States, without regard to its conflict of law provisions.
          </p>

          <h2>16. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the revised Terms.
          </p>

          <h2>17. Contact Us</h2>
          <p>
            If you have questions about these Terms, please contact us:
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
