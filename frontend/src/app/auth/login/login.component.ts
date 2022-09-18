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
    password: ['12trica34', [Validators.required]],
    // Ponemos el || de forma que si el checkbox estaba marcado para recordar el email, en el caso en el que esa opción hubiera estado marcada, la segunda parte de la condición será un true, así que se establecerá el valor del checkbox en true
    remember: [false || localStorage.getItem('email')]
  })

  ngOnInit(): void {}

  // Se ejecuta al enviar el formulario
  login (){

    this.formSubmit = true;
    console.log(this.loginForm);

    if (!this.loginForm.valid) {
      console.warn("Errores en el formulario");
    }

    // Llamamos al servicio para conectar frontend con backend
    // Indicamos el subscribe porque la función login es observable lo que indica que necesita de una respuesta
    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (result:any)=>{
        console.log(result);
        localStorage.setItem('token', result.token);
        this.router.navigateByUrl('/dashboard');

        if (this.loginForm.get('remember')?.value){
          // Le indicamos con el ! que estamos seguros de que este campo no llegará vacío
          localStorage.setItem('email', this.loginForm.get('email')?.value!);
        }
        else {
          localStorage.removeItem('email');
        }

      },
      error: (err:any)=>{
        console.warn('Error de la api', err);
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Ok',
          backdrop: false
        })
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
