interface sidebarSubItem {
  titulo: string;
  icono: string;
  url:string;
}


export interface sidebarItem
{
  titulo: string;
  icono: string;
  // Comprueba si hay submenú
  sub: boolean;
  url?: string;
  subMenu?:sidebarSubItem[];
  // Si queremos usar campos optativos éstos se añaden al final
}
