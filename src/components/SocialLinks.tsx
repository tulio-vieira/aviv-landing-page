import { CONTACT } from "@/config/site";
import { withBasePath } from "@/config/environment";

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
};

export function SocialLinks({
  className,
  iconClassName = "h-8 w-8",
}: SocialLinksProps) {
  return (
    <div className={className}>
      {/* <a
        href={CONTACT.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram da aviv SDG"
      >
        <img src={withBasePath("/icons/instagram.svg")} alt="" className={iconClassName} />
      </a> */}
      <a
        href={CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp da aviv SDG"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath("/icons/whatsapp.svg")} alt="" className={iconClassName} />
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <a
        href={CONTACT.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp da aviv SDG"
      >
        <img
          src={withBasePath("/icons/amazon.svg")}
          alt="Loja na Amazon em breve"
          className={iconClassName}
        />
      </a>
    </div>
  );
}
