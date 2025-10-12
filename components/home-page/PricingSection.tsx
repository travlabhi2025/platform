"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for getting started with trip organization",
      features: [
        "1 trip listing",
        "Basic trip management",
        "Customer booking system",
        "Email support",
        "Basic analytics",
      ],
      cta: "Get Started",
      href: "/signup",
      popular: false,
      buttonVariant: "outline" as const,
    },
    {
      name: "Standard",
      price: "₹4,999",
      period: "per month",
      description: "Ideal for growing trip organizers",
      features: [
        "Unlimited trip listings",
        "Advanced trip management",
        "Priority customer support",
        "Advanced analytics & insights",
        "Custom branding options",
        "Payment processing",
        "Booking management tools",
        "Marketing tools",
      ],
      cta: "Start Free Trial",
      href: "/signup-organizer",
      popular: true,
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations and agencies",
      features: [
        "Everything in Standard",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "Advanced reporting",
        "API access",
        "Custom training sessions",
        "24/7 phone support",
      ],
      cta: "Schedule a Call",
      href: "#contact",
      popular: false,
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-primary font-garetheavy mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start organizing amazing trips today. Scale as you grow with our
            flexible pricing plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-primary scale-105"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period !== "contact us" && (
                      <span className="text-gray-600 ml-2">
                        / {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link href={plan.href}>
                    <Button
                      className={`w-full py-3 text-lg font-semibold ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white"
                      }`}
                      variant={plan.buttonVariant}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  {/* Additional Info */}
                  {plan.name === "Standard" && (
                    <p className="text-sm text-gray-500 mt-3">
                      14-day free trial • No credit card required
                    </p>
                  )}
                  {plan.name === "Enterprise" && (
                    <p className="text-sm text-gray-500 mt-3">
                      Custom pricing based on your needs
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Mobile-responsive design</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Data backup & security</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Regular platform updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Community support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Terms & conditions compliance</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I switch plans anytime?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens to my data if I cancel?
              </h4>
              <p className="text-gray-600 text-sm">
                Your data is safely stored for 30 days after cancellation. You
                can reactivate anytime.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee for all paid plans. No
                questions asked.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a setup fee?
              </h4>
              <p className="text-gray-600 text-sm">
                No setup fees for any plan. You only pay the monthly
                subscription fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
