"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { TripFormData } from "@/lib/validations/trip";

// Define the FAQ item type
interface FaqItem {
  question: string;
  answer: string;
}

interface TripFAQsProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string>;
}

export default function TripFAQs({
  formData,
  updateFormData,
  onNext,
  onPrev,
  errors,
}: TripFAQsProps) {
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });

  const addFAQ = () => {
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      const currentFAQs = formData.faqs || [];
      updateFormData({
        faqs: [...currentFAQs, { ...newFAQ }],
      });
      setNewFAQ({ question: "", answer: "" });
    }
  };

  const removeFAQ = (index: number) => {
    const currentFAQs = formData.faqs || [];
    updateFormData({
      faqs: currentFAQs.filter((_, i) => i !== index),
    });
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const currentFAQs = formData.faqs || [];
    const updatedFAQs = currentFAQs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    );
    updateFormData({ faqs: updatedFAQs });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-600 text-sm">
          Add common questions and answers that travelers might have about your
          trip.
        </p>
      </div>

      {/* Existing FAQs */}
      {formData.faqs && formData.faqs.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Current FAQs</h4>
          {formData.faqs.map((faq: FaqItem, index) => (
            <Card key={index} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    FAQ #{index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label
                    htmlFor={`question-${index}`}
                    className="text-sm font-medium"
                  >
                    Question
                  </Label>
                  <Input
                    id={`question-${index}`}
                    value={faq.question}
                    onChange={(e) =>
                      updateFAQ(index, "question", e.target.value)
                    }
                    placeholder="e.g., What should I pack for this trip?"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`answer-${index}`}
                    className="text-sm font-medium"
                  >
                    Answer
                  </Label>
                  <Textarea
                    id={`answer-${index}`}
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                    placeholder="e.g., We recommend packing warm clothes, comfortable hiking boots, and a good camera."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New FAQ */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New FAQ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new-question" className="text-sm font-medium">
              Question
            </Label>
            <Input
              id="new-question"
              value={newFAQ.question}
              onChange={(e) =>
                setNewFAQ({ ...newFAQ, question: e.target.value })
              }
              placeholder="e.g., What should I pack for this trip?"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-answer" className="text-sm font-medium">
              Answer
            </Label>
            <Textarea
              id="new-answer"
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
              placeholder="e.g., We recommend packing warm clothes, comfortable hiking boots, and a good camera."
              className="mt-1 min-h-[80px]"
            />
          </div>
          <Button
            type="button"
            onClick={addFAQ}
            disabled={!newFAQ.question.trim() || !newFAQ.answer.trim()}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next: Review
        </Button>
      </div>
    </div>
  );
}
