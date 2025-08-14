import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function PrivacyPolicy() {
  const t = useTranslations("legal.privacy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("informationWeCollect.title")}
          </h2>
          <p className="mb-4">{t("informationWeCollect.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("informationWeCollect.personalInfo")}</li>
            <li>{t("informationWeCollect.usageData")}</li>
            <li>{t("informationWeCollect.cookies")}</li>
            <li>{t("informationWeCollect.thirdParty")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("howWeUseInfo.title")}
          </h2>
          <p className="mb-4">{t("howWeUseInfo.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("howWeUseInfo.provideService")}</li>
            <li>{t("howWeUseInfo.communicate")}</li>
            <li>{t("howWeUseInfo.improve")}</li>
            <li>{t("howWeUseInfo.security")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("dataSharing.title")}
          </h2>
          <p className="mb-4">{t("dataSharing.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("dataSharing.serviceProviders")}</li>
            <li>{t("dataSharing.legalRequirements")}</li>
            <li>{t("dataSharing.businessTransfer")}</li>
            <li>{t("dataSharing.consent")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("dataSecurity.title")}
          </h2>
          <p>{t("dataSecurity.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {t("yourRights.title")}
          </h2>
          <p className="mb-4">{t("yourRights.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("yourRights.access")}</li>
            <li>{t("yourRights.correction")}</li>
            <li>{t("yourRights.deletion")}</li>
            <li>{t("yourRights.portability")}</li>
            <li>{t("yourRights.objection")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("cookies.title")}</h2>
          <p className="mb-4">{t("cookies.description")}</p>
          <p>{t("cookies.management")}</p>
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
