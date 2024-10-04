const timeoutApply = (time: number) => {
  const timeout = setTimeout(() => {
    window.location.reload();
  }, time);
  const msg = `Получена команда на обновление.<br>
                Через 10 секунд ваша страница будет перезагружена автоматически.<br>
                Клик по сообщению предотвратит принудительную перезагурзку`;
  const div = document.createElement("div");
  div.className = "modal amber container pointer text-h5";
  div.setAttribute(
    "style",
    "display: block; top: 100px; padding:10px; border: solid red 5px"
  );
  div.innerHTML = msg;
  div.onclick = () => {
    clearTimeout(timeout);
    div.remove();
  };
  const db = document.body.querySelector("div");
  if (db !== null) {
    db.append(div);
  }
};

export default timeoutApply;
