import { IParserURLPattern, IParserURLResource } from "@/types/global";

function quoted (text: string): string {
  return "=%22" + text + "%22";
}

const nameUrlSM = (
  text: string,
  regSetting: IParserURLPattern[],
  resource: IParserURLResource[]
): string => {
  if (typeof text !== "string") {
    return text;
  }
  regSetting.forEach((e) => {
    const patt = '([^\\w\\/"]|^)(' + e.pattern + ")";
    let baseUrl = "";
    let param = "";
    let need_quoted = false;
    const res = resource.filter((r) => r.id === e.kod_resource);
    if (res.length) {
      baseUrl = res[0].base_url;
      param = res[0].query_param1;
      need_quoted = res[0].need_quoted;
    }
    const file = e.file;
    const query = e.query;
    const lclass = e.link_style;
    text = text.replace(new RegExp(patt, "g"), (ma, m1, m) => {
      let um = m;
      if (need_quoted) {
        um = quoted(encodeURI(m));
      }
      return (
        m1 +
        '<a target="_blank" class="out-link ' +
        lclass +
        '" href="' +
        baseUrl +
        file +
        param +
        query +
        um +
        '">' +
        m +
        "</a>"
      );
    });
  });

  return text;
};

export default nameUrlSM;
