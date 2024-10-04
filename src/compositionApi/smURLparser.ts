import nameUrlSM from "../functions/nameUrlSM";
import { useIndexStore } from "@/store";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";

export const smURLparserComposition = function () {
  const store = useIndexStore();
  const { updateState, fetchDataGet } = store;
  const smStore = useServiceManagerStore();

  if (smStore.patterns_time + 600000 < Date.now()) {
    updateState(useServiceManagerStore, "patterns_time", Date.now());
    (async () => {
      await fetchDataGet({
        module: useServiceManagerStore,
        tables: ["sm_url_patterns", "url_resource"],
      });
    })();
  }
  const urlParser = function (text: string): string {
    let parser = "";
    if (text) {
      parser = nameUrlSM(text, smStore.sm_url_patterns, smStore.url_resource);
    }
    return parser;
  };
  return {
    urlParser,
  };
};
