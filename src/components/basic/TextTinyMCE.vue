<template>
  <div class="blue--text">
    <label>{{ label }}</label>
    <textarea :id="uniqID" :value="value" />
  </div>
</template>

<script setup lang="ts">
// для просмотра путей импорта плагинов расскоментировать строку ниже
// plugins.forEach((e) => {
//   this.$projectDebug("import", '"tinymce/plugins/' + e + '";');
// });
import tinymce, { Editor } from "tinymce/tinymce";
/* Default icons are required for TinyMCE 5.3 or above */
import "tinymce/icons/default";

/* A theme is also required */
import "tinymce/themes/silver/theme";

/* Import the skin */
import "tinymce/skins/ui/oxide/skin.css";

// языковая поддержка npm install tinymce-i18n
// import "tinymce-i18n/langs5/ru_RU.js";
import "tinymce-i18n/langs/ru.js";

/* Import plugins */
import "tinymce/plugins/autoresize";
import "tinymce/plugins/preview";
import "tinymce/plugins/print";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/code";
import "tinymce/plugins/help";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/save";
import "tinymce/plugins/table";
import "tinymce/plugins/hr";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/directionality";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";
import "tinymce/plugins/image";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/template";
import "tinymce/plugins/paste";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/anchor";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/media";

/* Import premium plugins */
/* NOTE: Download separately and add these to /src/plugins */
/* import './plugins/checklist/plugin'; */
/* import './plugins/powerpaste/plugin'; */
/* import './plugins/powerpaste/js/wordimport'; */

/* Import content css */
// import "tinymce/skins/ui/oxide/content.css";
// import "tinymce/skins/content/default/content.css";
import { ref, toRefs, watch } from "vue";
import { uniq_id } from "@/compositionApi/UniqIDGenerate";
import projectDebug from "@/functions/projectDebug";
const plugins = [
  "autoresize",
  "preview",
  "pagebreak",
  "spellchecker",
  "searchreplace",
  "visualblocks",
  "visualchars",
  "help",
  "print",
  "code",
  "insertdatetime",
  "nonbreaking",
  "link",
  "lists",
  "save",
  "table",
  "contextmenu",
  "directionality",
  "emoticons",
  "hr",
  "image",
  "imagetools",
  "template",
  "paste",
  "textcolor",
  "anchor",
  "fullscreen",
  "media",
];
const emit = defineEmits(["input"]);
const props = defineProps({
  value: { type: String, default: "" },
  label: { type: String, default: "" },
});
const instance = ref<Editor[]>([]);
const { value } = toRefs(props);
const uniqID = uniq_id();
const tinyInit = () => {
  return tinymce
    .init({
      selector: "#" + uniqID,
      images_upload_url: "",
      base_url: "/js",
      convert_urls: false,
      images_upload_base_path: "",
      file_picker_callback (cb) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = function (evnt) {
          let files: FileList;
          if (evnt.target && "files" in evnt.target) {
            files = (evnt.target as HTMLInputElement).files as FileList;
          } else {
            return false;
          }
          const file = files[0];
          const reader = new FileReader();
          reader.onload = function () {
            const id = "blobid" + new Date().getTime();
            const blobCache = tinymce.activeEditor.editorUpload.blobCache;
            const base64 = String(reader.result).split(",")[1];
            const blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            /* call the callback and populate the Title field with the file name */
            cb(blobInfo.blobUri(), { title: file.name });
          };
          reader.readAsDataURL(file);
        };

        input.click();
      },
      file_picker_types: "image",
      a11y_advanced_options: true,
      automatic_uploads: true,
      language: "ru",
      entity_encoding: "raw",
      menubar: "format view insert help",
      fixed_toolbar_container: "#mytoolbar",
      extended_valid_elements:
        "img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|data-mce-src]",
      verify_html: false,
      plugins,
      paste_data_images: true,
      setup (ed) {
        ed.on("change", () => emit("input", ed.getContent()));
      },
      toolbar:
        "undo redo | styleselect | bold italic underline strikethrough forecolor backcolor | outdent indent | alignleft aligncenter alignright alignjustify | bullist numlist | " +
        " hr link table emoticons image | code preview fullscreen print |",
    })
    .then((editor) => {
      instance.value = editor;
      return editor;
    })
    .catch((e) => {
      projectDebug(e);
    });
};
watch(value, (val) => {
  if (val === "") {
    instance.value[0].setContent("");
  }
});

tinyInit().then(() => {
  if (instance.value.length === 0) {
    tinyInit();
  }
});
</script>

<style scoped>
input[type="text"]:not(.browser-default) {
  margin: 0;
}
</style>
