import { Component, NgZone } from "@angular/core";
import { Router } from "@angular/router";

import { LockComponent as BaseLockComponent } from "@bitwarden/angular/auth/components/lock.component";
import { DialogServiceAbstraction } from "@bitwarden/angular/services/dialog";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { EnvironmentService } from "@bitwarden/common/abstractions/environment.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { VaultTimeoutService } from "@bitwarden/common/abstractions/vaultTimeout/vaultTimeout.service";
import { VaultTimeoutSettingsService } from "@bitwarden/common/abstractions/vaultTimeout/vaultTimeoutSettings.service";
import { PolicyApiServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/policy/policy-api.service.abstraction";
import { InternalPolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { KeyConnectorService } from "@bitwarden/common/auth/abstractions/key-connector.service";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";

import { RouterService } from "../core";

@Component({
  selector: "app-lock",
  templateUrl: "lock.component.html",
})
export class LockComponent extends BaseLockComponent {
  constructor(
    router: Router,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    messagingService: MessagingService,
    cryptoService: CryptoService,
    vaultTimeoutService: VaultTimeoutService,
    vaultTimeoutSettingsService: VaultTimeoutSettingsService,
    environmentService: EnvironmentService,
    private routerService: RouterService,
    stateService: StateService,
    apiService: ApiService,
    logService: LogService,
    keyConnectorService: KeyConnectorService,
    ngZone: NgZone,
    policyApiService: PolicyApiServiceAbstraction,
    policyService: InternalPolicyService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    dialogService: DialogServiceAbstraction
  ) {
    super(
      router,
      i18nService,
      platformUtilsService,
      messagingService,
      cryptoService,
      vaultTimeoutService,
      vaultTimeoutSettingsService,
      environmentService,
      stateService,
      apiService,
      logService,
      keyConnectorService,
      ngZone,
      policyApiService,
      policyService,
      passwordGenerationService,
      dialogService
    );
  }

  async ngOnInit() {
    await super.ngOnInit();
    this.onSuccessfulSubmit = async () => {
      const previousUrl = this.routerService.getPreviousUrl();
      if (previousUrl && previousUrl !== "/" && previousUrl.indexOf("lock") === -1) {
        this.successRoute = previousUrl;
      }
      this.router.navigateByUrl(this.successRoute);
    };
  }
}
