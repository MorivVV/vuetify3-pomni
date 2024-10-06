import { useRoute } from "vue-router";

/**
 * расчет уровня доступа для компонентов
 */
export const routeAccessLevelCalculate = function () {
  const route = useRoute();
  const accessUserLevel = function (): number {
    let level = 0;
    if (route.meta && "level" in route.meta) {
      level = +route.meta.level;
    }
    return level;
  };
  /**
   * доступ без ограничений, максимальный уровень
   * @deprecated
   */
  const adminSuperLevel = () => accessUserLevel() >= 100;

  // уровень стандартного администратора
  /**
   * уровень стандартного администратора
   */
  const adminLevel = () => accessUserLevel() >= 70;

  // уровень расширенного доступа для добавления, изменения и удаления данных
  /**
   * уровень расширенного доступа для добавления, изменения и удаления данных
   */
  const moderatorSuperLevel = () => accessUserLevel() >= 50;

  // уровень доступа только для добавления, изменения и удаления данных
  /**
   * уровень доступа только для добавления, изменения и удаления данных
   */
  const moderatorLevel = () => accessUserLevel() >= 30;

  // уровень доступа только для добавления и изменения данных
  /**
   * уровень доступа только для добавления и изменения данных
   */
  const editLevel = () => accessUserLevel() >= 20;

  // уровень доступа только для добавления данных
  /**
   * уровень доступа только для добавления данных
   */
  const addLevel = () => accessUserLevel() >= 10;

  return {
    accessUserLevel,
    adminSuperLevel,
    addLevel,
    editLevel,
    moderatorLevel,
    moderatorSuperLevel,
    adminLevel,
  };
};
