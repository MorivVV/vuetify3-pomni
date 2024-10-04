import { Route } from "@/types/global";
export const makeRouter = (
  files: Record<string, { default: Route }>
) => {
  const children: Route[] = [];
  for (const key in files) {
    children.push(files[key].default);
  }
  children.sort((a, b) => {
    if (a.meta && "order" in a.meta) {
      if (b.meta && "order" in b.meta) {
        return Number(a.meta.order) - Number(b.meta.order);
      } else {
        return -1;
      }
    } else {
      if (b.meta && "order" in b.meta) {
        return 1;
      } else {
        return 0;
      }
    }
  });
  return children;
};
