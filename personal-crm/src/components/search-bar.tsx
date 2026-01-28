'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Contact } from '@/lib/types';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Contact[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setOpen(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search contacts..."
          className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {results.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                router.push(`/contacts/${contact.id}`);
                setOpen(false);
                setQuery('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border last:border-b-0"
            >
              <div className="text-sm font-medium text-foreground">
                {contact.firstName} {contact.lastName}
              </div>
              <div className="text-xs text-muted">
                {[contact.company, contact.email].filter(Boolean).join(' · ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
