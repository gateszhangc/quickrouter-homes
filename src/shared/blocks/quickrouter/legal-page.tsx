import { ArrowLeft, ShieldCheck } from 'lucide-react';

import { QuickRouterBrand } from './content';
import { LegalDoc } from './legal';

export function QuickRouterLegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main className="qr-legal">
      <div className="qr-container">
        <div className="qr-legal-head">
          <span className="qr-eyebrow">
            <ShieldCheck aria-hidden="true" />
            Legal
          </span>
          <h1>{doc.title}</h1>
          <p>{doc.intro}</p>
          <span className="qr-legal-updated">{doc.updated}</span>
        </div>

        <article className="qr-legal-body">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list?.length ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <p className="qr-legal-back">
            <a href="/">
              <ArrowLeft aria-hidden="true" />
              Back to {QuickRouterBrand.name}
            </a>
          </p>
        </article>
      </div>
    </main>
  );
}
