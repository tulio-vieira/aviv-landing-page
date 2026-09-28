import { withBasePath } from "@/config/environment";
import { CONTACT } from "@/config/site";

export function AmazonBanner() {
  return (
    <section className="bg-maroon px-4 py-8 text-center sm:px-6">
      <a
        href={CONTACT.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event="amazon_store"
        data-analytics-section="store" 
        >
        <p className="font-heading inline-flex flex-wrap items-center justify-center gap-3 text-xl text-white tracking-wide sm:text-2xl hover:underline">
          <span>Nossa loja na</span>
            <img
              src={withBasePath("/icons/amazon-logo.svg")}
              alt="Amazon"
              className="h-6 w-auto sm:h-7"
              style={{marginTop: "0.8em"}}
            />
        </p>
      </a>
    </section>
  );
}
