export interface loginForm
{
  email?: string | null;
  password?: string | null ;
  remember?: boolean | null | string;
  // Si queremos usar campos optativos éstos se añaden al final
}
