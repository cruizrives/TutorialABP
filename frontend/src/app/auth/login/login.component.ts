import { Component, OnInit } from '@angular/core';
// El objeto FormBuilder permite enlazarse con el formulario.html y recoger todo lo que pase en la vista
import { FormBuilder, Validators} from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  // Variable para impedir que las validaciones no salgan hasta que hayamos enviado el formulario
  public formSubmit = false;
  // Variable para comprobar si sale el icono de esperando
  public waiting = false;

  // Insertamos el componente FormBuilder necesario para conectar con el formulario del html
  constructor(
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router
  ) { }

  // Creamos objeto FormBuilder con los campos a validar
  public loginForm = this.fb.group({
    // Estado de los campos por defecto
    email: [ localStorage.getItem('email')||'', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    // Ponemos el || de forma que si el checkbox estaba marcado para recordar el email, en el caso en el que esa opción hubiera estado marcada, la segunda parte de la condición será un true, así que se establecerá el valor del checkbox en true
    remember: [false || localStorage.getItem('email')]
  })

  ngOnInit(): void {

    // Si el usuario con token intenta ir a login no debería poder hacerlo, por lo que siempre que tenga token, será redirigido a dashboard
    // Esto no es lo mejor ya que solo sirve para una ruta
    // this.usuarioService.validarToken().subscribe({
    //   next: (result) => {
    //     if (result){
    //       this.router.navigateByUrl('dashboard');
    //     }
    //   },});
  }

  // Se ejecuta al enviar el formulario
  login (){
    this.formSubmit = true;
    console.log(this.loginForm);

    if (!this.loginForm.valid) {
      console.warn("Errores en el formulario");
      // Hacemos este return para que cuando haya errores en el formulario no se lance la petición
      return;
    }
    this.waiting = true;
    // Llamamos al servicio para conectar frontend con backend
    // Indicamos el subscribe porque la función login es observable lo que indica que necesita de una respuesta
    this.usuarioService.login(this.loginForm.value).subscribe({
      next: ()=>{
        this.router.navigateByUrl('/dashboard');

        if (this.loginForm.get('remember')?.value){
          // Le indicamos con el ! que estamos seguros de que este campo no llegará vacío
          localStorage.setItem('email', this.loginForm.get('email')?.value!);
        }
        else {
          localStorage.removeItem('email');
        }
        this.waiting=false;

      },
      error: (err:any)=>{
        console.warn('Error de la api', err);
        Swal.fire({
          title: '¡Error!',
          // En el caso de que se lance un error no del backend sino de otra parte se devuelve un mensaje más amigable
          text: err.error.msg || 'No se pudo completar la acción, por favor inténtelo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        })
        this.waiting=false;
      }
    });
  }

  campoValido( campo: string){
    // Con get obtenemos cualquier campo del formulario
    // Valid -> true, cuando el campo sea correcto y false viceversa, por defecto envía un false
    // La variable formSubmit se inicializa a false
    // Mientras que el formulario no haya sido enviado, la variable formSubmit enviará un true y la primera condición un false, por lo que devolveremos un false || true -> true
    // Cuando se envía y hay errores, la variable formSubmit pasa a ser false y la primera condición a false, por lo que devolveremos un false || false -> false
    // Cuandos se envía y no hay errores, la variable formSubmit sigue siendo false y la primera condición true, por lo que devolveremos un true || false -> true
    return this.loginForm.get(campo)?.valid || !this.formSubmit ;
  }
}
