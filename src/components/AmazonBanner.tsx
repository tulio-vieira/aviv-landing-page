export function AmazonBanner() {
  return (
    <section className="bg-maroon px-4 py-8 text-center sm:px-6">
      <p className="font-heading inline-flex flex-wrap items-center justify-center gap-3 text-xl text-white tracking-wide sm:text-2xl">
        <span>Em breve, nossa loja na</span>
        <img
          src="/icons/amazon-logo.svg"
          alt="Amazon"
          className="h-6 w-auto sm:h-7"
          style={{marginTop: "0.8em"}}
        />
      </p>
    </section>
  );
}
