import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function TermsOfService() {
  const t = useTranslations("legal.terms");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("acceptance.title")}
          </h2>
          <p>{t("acceptance.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("description.title")}
          </h2>
          <p className="mb-4">{t("description.content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("userAccounts.title")}
          </h2>
          <p className="mb-4">{t("userAccounts.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("userAccounts.accurateInfo")}</li>
            <li>{t("userAccounts.security")}</li>
            <li>{t("userAccounts.notification")}</li>
            <li>{t("userAccounts.termination")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("acceptableUse.title")}
          </h2>
          <p className="mb-4">{t("acceptableUse.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("acceptableUse.compliance")}</li>
            <li>{t("acceptableUse.respectful")}</li>
            <li>{t("acceptableUse.noHarassment")}</li>
            <li>{t("acceptableUse.noSpam")}</li>
            <li>{t("acceptableUse.noIllegal")}</li>
            <li>{t("acceptableUse.noMalware")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("intellectualProperty.title")}
          </h2>
          <p className="mb-4">{t("intellectualProperty.description")}</p>
          <p>{t("intellectualProperty.userContent")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("privacy.title")}</h2>
          <p>{t("privacy.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("disclaimers.title")}
          </h2>
          <p className="mb-4">{t("disclaimers.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("disclaimers.noWarranty")}</li>
            <li>{t("disclaimers.availability")}</li>
            <li>{t("disclaimers.accuracy")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("limitationOfLiability.title")}
          </h2>
          <p>{t("limitationOfLiability.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("termination.title")}
          </h2>
          <p className="mb-4">{t("termination.description")}</p>
          <p>{t("termination.effects")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("governingLaw.title")}
          </h2>
          <p>{t("governingLaw.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("changes.title")}</h2>
          <p>{t("changes.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
          <p className="mb-4">{t("contact.description")}</p>
          <p>
            <strong>{t("contact.email")}:</strong>{" "}
            <a
              href="mailto:monir.mzs17@gmail.com"
              className="text-primary hover:underline"
            >
              monir.mzs17@gmail.com
            </a>
          </p>
        </section>

        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="text-primary hover:underline font-medium">
            ← {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
