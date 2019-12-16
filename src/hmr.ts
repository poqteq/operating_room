import { NgModuleRef, ApplicationRef } from "@angular/core";
import { createNewHosts } from "@angularclass/hmr";

export const hmrBootstrap = (
  module: any,
  bootstrap: () => Promise<NgModuleRef<any>>
) => {
  let ngModule: NgModuleRef<any>;
  module.hot.accept();
  bootstrap().then(mod => {
    if ((<any>window).appBootstrap) {
      (<any>window).appBootstrap();
    }
    ngModule = mod;
  });
  module.hot.dispose(() => {
    const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
    const elements = appRef.components.map(c => c.location.nativeElement);
    const makeVisible = createNewHosts(elements);
    ngModule.destroy();
    makeVisible();
  });
};
export function preloaderFinished() {
  const /** @type {?} */ body = document.querySelector("body");
  const /** @type {?} */ preloader = document.querySelector(".preloader");
  body.style.overflow = "hidden";
  /**
   * @return {?}
   */
  function remove() {
    // preloader value null when running --hmr
    if (!preloader) {
      return;
    }

    preloader.addEventListener("transitionend", function() {
      preloader.className = "preloader-hidden";
    });
    preloader.className += " preloader-hidden-add preloader-hidden-add-active";
  }
  let clearID;
  (<any>window).appBootstrap = function() {
    clearID = setInterval(_ => {
      if (
        document.querySelector("layout-fullscreen") ||
        document.querySelector("layout-passport") ||
        document.querySelector("layout-fixed-top-sidebar") ||
        document.querySelector("layout-fixed-top") ||
        document.querySelector("layout-fixed-sidebar") ||
        document.querySelector("layout-fixed-sidebar-split") ||
        document.querySelector("layout-static-vertical") ||
        document.querySelector("router-outlet")
      ) {
        clearInterval(clearID);
        remove();
        body.style.overflow = "";
      }
    }, 100);
  };
}
