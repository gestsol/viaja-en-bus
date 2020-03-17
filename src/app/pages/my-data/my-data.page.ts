import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { MyserviceService } from 'src/app/service/myservice.service';
import * as _ from 'underscore';
import * as moment from 'moment';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
})
export class MyDataPage implements OnInit {

  pageMyDataAsRegister = false
  nombreUsuario = 'Usuario'
  usuario
  loading = false
  myData = {
    rut: "",
    email: "",
    nombre: "",
    apellidoMaterno: "",
    apellidoPaterno: "",
    estado: "ACT",
    fechaCreacion: "",
    fechaNacimiento: "",
    fechaActivacion: "",
    password: "",
    clave: "",

    telefono: '+56',
    celular: '+56',
    region: '',
    ciudad: '',


    dia: '',
    mes: '',
    anio: '',
    genero: ''
  }

  ciudadesEspecificas = []
  regionesAll = [
    {
      codigo: "15",
      descripcion: "XV Arica y Parinacota",
      ordenGeografico: "1"
    },
    {
      codigo: "1",
      descripcion: "I Tarapacá",
      ordenGeografico: "2"
    },
    {
      codigo: "2",
      descripcion: "II Antofagasta",
      ordenGeografico: "3"
    },
    {
      codigo: "3",
      descripcion: "III Atacama",
      ordenGeografico: "4"
    },
    {
      codigo: "4",
      descripcion: "IV Coquimbo",
      ordenGeografico: "5"
    },
    {
      codigo: "5",
      descripcion: "V Valparaíso",
      ordenGeografico: "6"
    },
    {
      codigo: "13",
      descripcion: "Región Metropolitana",
      ordenGeografico: "7"
    },
    {
      codigo: "6",
      descripcion: "VI O'Higgins",
      ordenGeografico: "8"
    },
    {
      codigo: "7",
      descripcion: "VII Maule",
      ordenGeografico: "9"
    },
    {
      codigo: "8",
      descripcion: "VIII Biobío",
      ordenGeografico: "10"
    },
    {
      codigo: "9",
      descripcion: "IX La Araucanía",
      ordenGeografico: "11"
    },
    {
      codigo: "14",
      descripcion: "XIV Los Ríos",
      ordenGeografico: "12"
    },
    {
      codigo: "10",
      descripcion: "X Los Lagos",
      ordenGeografico: "13"
    },
    {
      codigo: "11",
      descripcion: "XI Aysén",
      ordenGeografico: "14"
    },
    {
      codigo: "12",
      descripcion: "XII Magallanes y Antártica",
      ordenGeografico: "15"
    }
  ]

  diaOptions = { header: 'Elige el día' };
  mesOptions = { header: 'Elige el mes' };
  anioOptions = { header: 'Elige el año' };
  regionOptions = { header: 'Elija su región' };
  cityOptions = { header: 'Elija su ciudad' };

  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {


    this.myData = {
      rut: "",
      email: "",
      nombre: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      estado: "ACT",
      fechaCreacion: "",
      fechaNacimiento: "",
      fechaActivacion: "",
      password: "",
      clave: "",

      telefono: '+56',
      celular: '+56',
      region: '',
      ciudad: '',


      dia: '',
      mes: '',
      anio: '',
      genero: ''
    }

    this.mys.checkIfExistUsuario().subscribe(existe => {
      if (existe) {
        console.log('Usuario Registrado, Entonces Modifica');
        this.pageMyDataAsRegister = false
        this.loading = true
        this.mys.getUser().subscribe(usuario => {
          console.log('usuario', usuario);
          this.loading = false
          this.usuario = usuario

          this.myData.nombre = this.titleCase(usuario.usuario.nombre)
          this.myData.apellidoPaterno = this.titleCase(usuario.usuario.apellidoPaterno)
          this.myData.apellidoMaterno = this.titleCase(usuario.usuario.apellidoMaterno)
          this.myData.email = usuario.usuario.email
          this.myData.estado = usuario.usuario.estado
          this.myData.rut = usuario.usuario.rut

          this.myData.dia = parseInt(moment(usuario.usuario.fechaNacimiento).format('D'))+1+''
          this.myData.mes = moment(usuario.usuario.fechaNacimiento).format('M')
          this.myData.anio = moment(usuario.usuario.fechaNacimiento).format('YYYY')

          this.myData.fechaNacimiento = moment(usuario.usuario.fechaNacimiento).format('L')
          this.myData.fechaCreacion = moment(usuario.usuario.fechaCreacion).format('DD-MM-YYYY')
          this.myData.fechaActivacion = moment(usuario.usuario.fechaActivacion).format('DD-MM-YYYY')

          this.myData.genero = usuario.usuario.genero
          this.myData.telefono = usuario.usuario.telefono
          this.myData.celular = usuario.usuario.celular
          this.myData.ciudad = usuario.usuario.ciudad


          this.myData.region = usuario.usuario.region

          this.cambioDeRegion()

          if (usuario.usuario.nombre && usuario.usuario.apellidoPaterno) {
            this.nombreUsuario = usuario.usuario.nombre + ' ' + usuario.usuario.apellidoPaterno
            console.log('this.nombre', this.nombreUsuario);
          } else {
            this.nombreUsuario = 'Usuario'
            console.log('this.nombre2', this.nombreUsuario);
          }
          console.log('this.myData',this.myData)
        })

      } else {
        console.log('Usuario NO Registrado, Entonces Registra');
        this.pageMyDataAsRegister = true
        console.log('this.nombreUsuario', this.nombreUsuario);
      }
    })
  }


  myKeyUp(elemento) {
    // console.log('presionado elemento: ', elemento);
  }

  genero($event) {


  }

  validar(forma) {
    console.log('forma', forma);
    this.myData.fechaNacimiento = `${this.myData.dia}-${this.myData.mes}-${this.myData.anio}`
    console.log('this.myData.fechaNacimiento', this.myData.fechaNacimiento);

    if (forma.controls.rut.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un RUT válido')      // } else if (rut valido) {console.log('rut valido');
    } else if (forma.controls.nombre.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un nombre válido')
    } else if (forma.controls.apellidoPaterno.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un apellido Paterno válido')
    } else if (forma.controls.apellidoMaterno.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un apellido materno válido')
    } else if (!moment(this.myData.fechaNacimiento, ["DD-MM-YYYY", "D-MM-YYYY", "D-M-YYYY", "DD-M-YYYY"], true).isValid()) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Verifique que la fecha de nacimiento sea válida')
    } else if (forma.controls.email.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un email válido')
    } else if (forma.controls.clave && forma.controls.clave.errors && this.pageMyDataAsRegister) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una clave para inicio de sesión válida y mayor o igual a 8 caracteres')
      // } else if (forma.controls.ocupacion.errors) {
      //   this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca ocupacion válida')
    } else if (forma.controls.telefono.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un teléfono válido')
    } else if (forma.controls.celular.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca un celular válido')
    } else if (forma.controls.region.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una región válida')
    } else if (forma.controls.ciudad.errors) {
      this.mys.alertShow('Verifique!! ', 'alert', 'Introduzca una ciudad válida')
    } else {
      console.log('fiiiiiiiiinnnnnnnnnnnnnnnn');

      let objetoAenviar = {
        rut: this.myData.rut,
        nombre: this.myData.nombre,
        apellidoPaterno: this.myData.apellidoPaterno,
        apellidoMaterno: this.myData.apellidoMaterno,
        email: this.myData.email,
        estado: this.myData.estado,
        fechaCreacion: this.myData.fechaCreacion,
        fechaNacimiento: this.myData.fechaNacimiento,
        password: this.myData.password,

        genero: this.myData.genero,
        telefono: this.myData.telefono,
        celular: this.myData.celular,
        ciudad: this.myData.ciudad,
        // profesion: this.m  yData.profesion,
        // areaFono: this.myData.areaFono,
        // areaCelular: this.myData.areaCelular,
        region: this.myData.region
      }

      this.pageMyDataAsRegister ? objetoAenviar['clave'] = this.myData.clave : null
      console.log('guardado usuario:', objetoAenviar);
      this.loading = true
      this.integrador.usuarioGuardar(objetoAenviar).subscribe((respuesta: any) => {
        this.loading = false

        if (respuesta.exito) {


          this.usuario.usuario.rut = objetoAenviar.rut
          this.usuario.usuario.nombre = objetoAenviar.nombre
          this.usuario.usuario.apellidoPaterno = objetoAenviar.apellidoPaterno
          this.usuario.usuario.apellidoMaterno = objetoAenviar.apellidoMaterno
          this.usuario.usuario.email = objetoAenviar.email
          this.usuario.usuario.estado = objetoAenviar.estado
          this.usuario.usuario.genero = objetoAenviar.genero
          this.usuario.usuario.telefono = objetoAenviar.telefono
          this.usuario.usuario.celular = objetoAenviar.celular
          this.usuario.usuario.ciudad = objetoAenviar.ciudad
          this.usuario.usuario.region = objetoAenviar.region

          this.usuario.usuario.fechaNacimiento = parseInt(moment(objetoAenviar.fechaNacimiento, "DD-MM-YYYY").format('x'))

          this.mys.closeSessionUser().subscribe(cerrado => {
            this.mys.saveUsuario(this.usuario).subscribe(guardado => {
              if (guardado) {
                console.log('guardadooooooo');
              } else {
                console.log('NOOO guardadooooooo');
              }
            })
          })

          console.log('this.usuario', this.usuario);


        } else {
          this.mys.alertShow('Error ', 'alert', respuesta.mensaje || 'Hubo un error al guardar los datos del usuario..')
        }


        console.log('respuesta', respuesta);
      })

      // console.log('objetoAenviar', objetoAenviar);
      // console.log('this.myData', this.myData);


    }

  }// fin validar



  /**
   *  para cambiar nombres y apellidos a titulo capital
   * @param str 
   */
  titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }

  cambioDeRegion() {
    this.loading = true
    console.log('cambiooooo', this.myData.region);
    this.integrador.buscarCiudadPorRegionesRegistroDeUsuario({ codigo: this.myData.region }).subscribe(ciudades => {
      this.loading = false
      this.ciudadesEspecificas = ciudades
    })
  }
} // fin clase ppal


          ////////////////////////////////////////// Recibido de api
          // nombre: "angelox"
          // apellidoPaterno: "ochoa"
          // apellidoMaterno: "alarcon"
          // email: "ochoaangelox@gmail.com"
          // estado: "ACT"
          // fechaNacimiento: 435726000000
          // fechaCreacion: 1586487600000
          // fechaActivacion: 1586487600000
          // password: "d1079ca8833395c01233c96f4ec4065221801037"
          // rut: "11111111-1"
          ////////////////////////////////////////// Enviado a la api
          // {
          //   "nombre":"angelox",
          //   "apellidoPaterno":"ochoa",
          //   "apellidoMaterno":"alarcon",
          //   "email":"ochoaangelox@gmail.com",
          //   "estado":"ACT",
          //   "fechaCreacion":"10-04-2020",
          //   "fechaNacimiento":"23-10-1983",
          //   "password":"123456"
          //   "rut":"11111111-1",
          // }
