import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { Component, Inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";

import { DialogServiceAbstraction } from "@bitwarden/angular/services/dialog";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";

import { ServiceAccountView } from "../../models/view/service-account.view";
import {
  BulkOperationStatus,
  BulkStatusDetails,
  BulkStatusDialogComponent,
} from "../../shared/dialogs/bulk-status-dialog.component";
import { ServiceAccountService } from "../service-account.service";

export interface ServiceAccountDeleteOperation {
  serviceAccounts: ServiceAccountView[];
}

@Component({
  templateUrl: "./service-account-delete-dialog.component.html",
})
export class ServiceAccountDeleteDialogComponent {
  formGroup = new FormGroup({
    confirmDelete: new FormControl("", [this.matchConfirmationMessageValidator()]),
  });

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: ServiceAccountDeleteOperation,
    private serviceAccountService: ServiceAccountService,
    private i18nService: I18nService,
    private platformUtilsService: PlatformUtilsService,
    private dialogService: DialogServiceAbstraction
  ) {}

  get title() {
    return this.data.serviceAccounts.length === 1
      ? this.i18nService.t("deleteServiceAccount")
      : this.i18nService.t("deleteServiceAccounts");
  }

  get dialogContent() {
    return this.data.serviceAccounts.length === 1
      ? this.i18nService.t("deleteServiceAccountDialogMessage", this.data.serviceAccounts[0].name)
      : this.i18nService.t("deleteServiceAccountsDialogMessage");
  }

  get dialogConfirmationLabel() {
    return this.i18nService.t("deleteProjectInputLabel", this.dialogConfirmationMessage);
  }

  submit = async () => {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    await this.delete();
    this.dialogRef.close();
  };

  async delete() {
    const bulkResponses = await this.serviceAccountService.delete(this.data.serviceAccounts);

    const errors = bulkResponses.filter((response) => response.errorMessage);
    if (errors.length > 0) {
      this.openBulkStatusDialog(errors);
      return;
    }

    const message =
      this.data.serviceAccounts.length === 1
        ? "deleteServiceAccountToast"
        : "deleteServiceAccountsToast";
    this.platformUtilsService.showToast("success", null, this.i18nService.t(message));
  }

  openBulkStatusDialog(bulkStatusResults: BulkOperationStatus[]) {
    this.dialogService.open<unknown, BulkStatusDetails>(BulkStatusDialogComponent, {
      data: {
        title: "deleteServiceAccounts",
        subTitle: "serviceAccounts",
        columnTitle: "serviceAccountName",
        message: "bulkDeleteProjectsErrorMessage",
        details: bulkStatusResults,
      },
    });
  }

  private get dialogConfirmationMessage() {
    return this.data.serviceAccounts?.length === 1
      ? this.i18nService.t("deleteProjectConfirmMessage", this.data.serviceAccounts[0].name)
      : this.i18nService.t(
          "deleteServiceAccountsConfirmMessage",
          this.data.serviceAccounts?.length.toString()
        );
  }

  private matchConfirmationMessageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.dialogConfirmationMessage.toLowerCase() == control.value.toLowerCase()) {
        return null;
      } else {
        return {
          confirmationDoesntMatchError: {
            message: this.i18nService.t("smConfirmationRequired"),
          },
        };
      }
    };
  }
}
