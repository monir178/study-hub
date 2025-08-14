import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shield, Lock, Eye, Key, AlertTriangle } from "lucide-react";

export default function Security() {
  const t = useTranslations("legal.security");

  const securityFeatures = [
    {
      icon: Shield,
      title: t("features.encryption.title"),
      description: t("features.encryption.description"),
    },
    {
      icon: Lock,
      title: t("features.authentication.title"),
      description: t("features.authentication.description"),
    },
    {
      icon: Eye,
      title: t("features.monitoring.title"),
      description: t("features.monitoring.description"),
    },
    {
      icon: Key,
      title: t("features.accessControl.title"),
      description: t("features.accessControl.description"),
    },
  ];

  const bestPractices = [
    t("bestPractices.strongPassword"),
    t("bestPractices.twoFactor"),
    t("bestPractices.regularUpdates"),
    t("bestPractices.secureConnection"),
    t("bestPractices.logout"),
    t("bestPractices.reportIssues"),
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("overview.title")}</h2>
          <p className="mb-4">{t("overview.description")}</p>
          <p>{t("overview.commitment")}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("features.title")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {t("dataProtection.title")}
          </h2>
          <p className="mb-4">{t("dataProtection.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("dataProtection.encryption")}</li>
            <li>{t("dataProtection.access")}</li>
            <li>{t("dataProtection.backup")}</li>
            <li>{t("dataProtection.compliance")}</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {t("bestPractices.title")}
          </h2>
          <p className="mb-4">{t("bestPractices.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            {bestPractices.map((practice, index) => (
              <li key={index}>{practice}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {t("incidentResponse.title")}
          </h2>
          <p className="mb-4">{t("incidentResponse.description")}</p>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">
                  {t("incidentResponse.reporting.title")}
                </h4>
                <p className="mb-3">
                  {t("incidentResponse.reporting.description")}
                </p>
                <p>
                  <strong>{t("incidentResponse.reporting.email")}:</strong>{" "}
                  <a
                    href="mailto:monir.mzs17@gmail.com"
                    className="text-primary hover:underline"
                  >
                    monir.mzs17@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {t("compliance.title")}
          </h2>
          <p className="mb-4">{t("compliance.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("compliance.gdpr")}</li>
            <li>{t("compliance.ferpa")}</li>
            <li>{t("compliance.coppa")}</li>
            <li>{t("compliance.industry")}</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t("contact.title")}</h2>
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
