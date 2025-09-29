"use client";

import SiteHeader from "@/components/common/SiteHeader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TripTermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-16 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-garetheavy text-primary text-4xl md:text-5xl mb-4">
            Trip Terms and Conditions
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions (&quot;Trip Terms&quot;) govern your
              participation in travel experiences organized through the
              TravlAbhi platform. By booking a trip, you agree to be bound by
              these terms and the general platform terms of service.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              These terms are in addition to and do not replace the general
              TravlAbhi Terms and Conditions. In case of any conflict, these
              Trip Terms shall take precedence for matters relating to trip
              participation.
            </p>
          </section>

          {/* Booking and Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Booking and Payment Terms
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              2.1 Booking Process
            </h3>
            <p className="text-gray-700 leading-relaxed">
              All trip bookings are subject to availability and confirmation by
              the trip organizer. A booking is considered confirmed only when
              payment is received and booking confirmation is issued.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              2.2 Payment Terms
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Full payment is required at the time of booking unless otherwise
                specified
              </li>
              <li>
                All prices are in Indian Rupees (INR) and include applicable
                taxes
              </li>
              <li>
                Prices are subject to change without notice until booking is
                confirmed
              </li>
              <li>
                Additional costs for personal expenses, optional activities, and
                services not included in the package are the participant&apos;s
                responsibility
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              2.3 Refund and Cancellation Policy
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Cancellation and refund policies vary by trip organizer and are
              clearly stated during the booking process. Standard policies
              include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Cancellations made 30+ days before departure: 80% refund</li>
              <li>
                Cancellations made 15-29 days before departure: 50% refund
              </li>
              <li>Cancellations made 7-14 days before departure: 25% refund</li>
              <li>
                Cancellations made less than 7 days before departure: No refund
              </li>
            </ul>
          </section>

          {/* Participant Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Participant Responsibilities
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.1 Health and Fitness Requirements
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Participants must ensure they are physically and mentally fit to
              participate in the chosen trip. It is your responsibility to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>
                Consult with a healthcare provider before booking physically
                demanding trips
              </li>
              <li>
                Disclose any medical conditions that may affect participation
              </li>
              <li>Carry necessary medications and medical documents</li>
              <li>
                Inform the trip organizer of any special dietary requirements
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              3.2 Documentation and Compliance
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Participants are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Valid identification documents (Aadhaar, Passport, etc.)</li>
              <li>Required permits, visas, and travel documents</li>
              <li>
                Travel insurance covering medical emergencies and trip
                cancellation
              </li>
              <li>
                Compliance with local laws and regulations at all destinations
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              3.3 Conduct and Behavior
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Participants must maintain appropriate behavior throughout the
              trip:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>
                Respect local customs, traditions, and cultural sensitivities
              </li>
              <li>Follow instructions from trip organizers and local guides</li>
              <li>Avoid activities that may endanger yourself or others</li>
              <li>Maintain cleanliness and environmental responsibility</li>
            </ul>
          </section>

          {/* Trip Organizer Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Trip Organizer Responsibilities
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              4.1 Service Delivery
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Trip organizers are responsible for providing the services as
              described in the trip listing, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Transportation as specified in the itinerary</li>
              <li>Accommodation meeting the described standards</li>
              <li>Qualified guides and support staff</li>
              <li>Safety equipment and emergency procedures</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              4.2 Safety and Emergency Procedures
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Trip organizers must maintain appropriate safety standards and
              have emergency response procedures in place, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>First aid equipment and trained personnel</li>
              <li>Emergency contact information and communication devices</li>
              <li>Evacuation procedures for remote locations</li>
              <li>Weather monitoring and alternative plans</li>
            </ul>
          </section>

          {/* Safety and Risk Management */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Safety and Risk Management
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              5.1 Acknowledgment of Risks
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Travel inherently involves risks including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Natural disasters and extreme weather conditions</li>
              <li>Transportation accidents and mechanical failures</li>
              <li>Health emergencies and medical complications</li>
              <li>Political instability and security concerns</li>
              <li>Wildlife encounters and outdoor hazards</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              5.2 Limitation of Liability
            </h3>
            <p className="text-gray-700 leading-relaxed">
              TravlAbhi and trip organizers shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Acts of God, natural disasters, or force majeure events</li>
              <li>
                Personal injury or death resulting from participant negligence
              </li>
              <li>Loss or damage to personal belongings</li>
              <li>
                Delays or cancellations due to circumstances beyond control
              </li>
              <li>Additional expenses incurred due to trip modifications</li>
            </ul>
          </section>

          {/* Insurance Requirements */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Insurance Requirements
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              6.1 Mandatory Travel Insurance
            </h3>
            <p className="text-gray-700 leading-relaxed">
              All participants must obtain comprehensive travel insurance
              covering:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Medical emergencies and hospitalization</li>
              <li>Emergency medical evacuation</li>
              <li>Trip cancellation and interruption</li>
              <li>Personal accident and liability coverage</li>
              <li>Loss of personal belongings</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              6.2 Insurance Documentation
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Participants must provide proof of insurance before trip
              departure. Failure to provide adequate insurance may result in
              trip exclusion with no refund.
            </p>
          </section>

          {/* Weather and Force Majeure */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Weather and Force Majeure
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              7.1 Weather-Related Changes
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Trip organizers reserve the right to modify itineraries due to
              weather conditions for safety reasons. Alternative activities will
              be provided when possible, but no refunds will be issued for
              weather-related itinerary changes.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              7.2 Force Majeure Events
            </h3>
            <p className="text-gray-700 leading-relaxed">
              In case of force majeure events (natural disasters, political
              unrest, pandemics, etc.), trips may be cancelled or postponed.
              Refund policies will be applied as per the circumstances and
              applicable laws.
            </p>
          </section>

          {/* Photography and Media */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Photography and Media Rights
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              8.1 Trip Photography
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Trip organizers may take photographs and videos during the trip
              for promotional purposes. By participating, you consent to the use
              of your image in marketing materials unless you specifically opt
              out in writing.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              8.2 Participant Photography
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Participants are encouraged to take personal photographs but must
              respect the privacy of other participants and local communities.
              Commercial use of trip-related photography requires prior written
              permission.
            </p>
          </section>

          {/* Environmental Responsibility */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Environmental Responsibility
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All participants must adhere to sustainable tourism practices:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Follow Leave No Trace principles</li>
              <li>Respect wildlife and natural habitats</li>
              <li>Minimize waste and use eco-friendly products</li>
              <li>Support local communities and sustainable practices</li>
              <li>Follow designated trails and camping areas</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Dispute Resolution
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              10.1 Governing Law
            </h3>
            <p className="text-gray-700 leading-relaxed">
              These Trip Terms are governed by the laws of India and are subject
              to the jurisdiction of Indian courts.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">
              10.2 Dispute Process
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising from trip participation should first be
              addressed through:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2 mt-4">
              <li>Direct communication with the trip organizer</li>
              <li>Mediation through TravlAbhi customer support</li>
              <li>Arbitration in accordance with Indian arbitration laws</li>
              <li>Legal proceedings in courts of competent jurisdiction</li>
            </ol>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Modifications to Trip Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Trip Terms may be updated from time to time. Participants
              will be notified of material changes through the platform or email
              communication. Continued participation in trips after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For questions regarding these Trip Terms and Conditions, please
              contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="text-gray-700">
                <strong>Email:</strong> trips@travlabhi.com
              </p>
              <p className="text-gray-700">
                <strong>Customer Support:</strong> +91-XXXX-XXXX
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> TravlAbhi Pvt. Ltd., [Company
                Address], India
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Acknowledgment
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By booking a trip through TravlAbhi, you acknowledge that you have
              read, understood, and agree to be bound by these Trip Terms and
              Conditions, along with all applicable laws and regulations.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p className="text-sm">
            These Trip Terms and Conditions are designed to ensure safe,
            enjoyable, and responsible travel experiences for all participants.
          </p>
        </div>
      </main>
    </div>
  );
}
