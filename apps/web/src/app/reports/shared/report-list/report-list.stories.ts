import { importProvidersFrom } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { Meta, Story, applicationConfig, moduleMetadata } from "@storybook/angular";

import { JslibModule } from "@bitwarden/angular/jslib.module";
import { BadgeModule, IconModule } from "@bitwarden/components";

import { PreloadedEnglishI18nModule } from "../../../tests/preloaded-english-i18n.module";
import { PremiumBadgeComponent } from "../../../vault/components/premium-badge.component";
import { reports } from "../../reports";
import { ReportVariant } from "../models/report-variant";
import { ReportCardComponent } from "../report-card/report-card.component";

import { ReportListComponent } from "./report-list.component";

export default {
  title: "Web/Reports/List",
  component: ReportListComponent,
  decorators: [
    moduleMetadata({
      imports: [JslibModule, BadgeModule, RouterTestingModule, IconModule],
      declarations: [PremiumBadgeComponent, ReportCardComponent],
    }),
    applicationConfig({
      providers: [importProvidersFrom(PreloadedEnglishI18nModule)],
    }),
  ],
  args: {
    reports: Object.values(reports).map((report) => ({
      ...report,
      variant:
        report.route == "breach-report" ? ReportVariant.Enabled : ReportVariant.RequiresPremium,
    })),
  },
} as Meta;

const Template: Story<ReportListComponent> = (args: ReportListComponent) => ({
  props: args,
});

export const Default = Template.bind({});
