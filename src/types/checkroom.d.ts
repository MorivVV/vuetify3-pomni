interface ICheckroomBox {
  cnt: string;
  color: string;
  dep: number;
  num_box: string;
  kod_location?: number;
  _id: number;
}
interface ICheckroomEmployee {
  user_id: number;
  fio: string;
  kod_box: number;
  kod_depart: number;
  num: string;
  id?: number;
  depart: string;
  color: string;
}
interface ICheckroomLocation {
  id: number;
  coordinats: string;
  unit: number;
}
interface ICheckroomDepartament {
  id: number;
  dep: string;
  addr: number;
  color: string;
}
