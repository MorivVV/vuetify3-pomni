import { defineStore } from "pinia";

export const useCheckRoomStore = defineStore("checkroom", {
  state: () => ({
    employees: [] as ICheckroomEmployee[],
    usersProfiles: [] as IUserPrifile[],
    departaments: [] as ICheckroomDepartament[],
    boxes: [] as ICheckroomBox[],
    loc: 1,
    locations: [] as ICheckroomLocation[],
  }),
  getters: {},
});
