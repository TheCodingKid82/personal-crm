'use client';

import ContactForm from '@/components/contact-form';

export default function NewContactPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Add Contact</h1>
        <p className="text-muted text-sm mt-1">Add a new person to your network</p>
      </div>
      <ContactForm />
    </div>
  );
}
