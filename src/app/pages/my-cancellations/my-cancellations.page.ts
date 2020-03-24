import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/service/myservice.service';
import { IntegradorService } from 'src/app/service/integrador.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopMenuComponent } from 'src/app/components/pop-menu/pop-menu.component';
import { PopCartComponent } from 'src/app/components/pop-cart/pop-cart.component';
import * as moment from 'moment';


@Component({
  selector: 'app-my-cancellations',
  templateUrl: './my-cancellations.page.html',
  styleUrls: ['./my-cancellations.page.scss'],
})
export class MyCancellationsPage implements OnInit {

  boletosAll = []
  transaccionesAll = []
  usuario
  loading = 0
  nBoletosSeleccionados = 0

  tipoDeCuentaOptions = { header: 'Tipo de Cuenta' }
  bancoOptions = { header: 'Banco' }

  myData = {
    tiposDeCuentas: [
      {
        codigo: "CuentaCorriente",
        nombre: "Cuenta Corriente"
      },
      {
        codigo: "CuentaVista",
        nombre: "Cuenta Vista"
      }
    ],
    tipoDeCuenta: '',
    codigoBoletoAconsultar: '',
    numeroDeCuenta: '',
    bancos: [
      {
        codigo: "Banco BICE",
        nombre: "Banco BICE"
      },
      {
        codigo: "BBVA",
        nombre: "BBVA"
      },
      {
        codigo: "Banco Btg Pactual Chile",
        nombre: "Banco Btg Pactual Chile"
      },
      {
        codigo: "Banco Consorcio",
        nombre: "Banco Consorcio"
      },
      {
        codigo: "Banco de Chile",
        nombre: "Banco de Chile"
      },
      {
        codigo: "BCI",
        nombre: "BCI"
      },
      {
        codigo: "Banco Estado",
        nombre: "Banco Estado"
      },
      {
        codigo: "Banco do Brasil S.A.",
        nombre: "Banco do Brasil S.A."
      },
      {
        codigo: "Banco Falabella",
        nombre: "Banco Falabella"
      },
      {
        codigo: "Banco Internacional",
        nombre: "Banco Internacional"
      },
      {
        codigo: "Banco Itaú Chile",
        nombre: "Banco Itaú Chile"
      },
      {
        codigo: "Banco Penta",
        nombre: "Banco Penta"
      },
      {
        codigo: "Banco Ripley",
        nombre: "Banco Ripley"
      },
      {
        codigo: "Banco Santander",
        nombre: "Banco Santander"
      },
      {
        codigo: "Banco Security",
        nombre: "Banco Security"
      },
      {
        codigo: "Corpbanca",
        nombre: "Corpbanca"
      },
      {
        codigo: "Deutsche Bank Chile",
        nombre: "Deutsche Bank Chile"
      },
      {
        codigo: "HSBC Bank Chile",
        nombre: "HSBC Bank Chile"
      },
      {
        codigo: "JP Morgan Chase Bank",
        nombre: "JP Morgan Chase Bank"
      },
      {
        codigo: "Rabobank Chile",
        nombre: "Rabobank Chile"
      },
      {
        codigo: "Scotiabank",
        nombre: "Scotiabank"
      }
    ],
    rutTitular: '',
    banco: ''
  }
  constructor(
    private mys: MyserviceService,
    private integrador: IntegradorService,
    private router: Router,
    private popoverCtrl: PopoverController,


  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.mys.getUser().subscribe(usuario => {
      this.usuario = usuario
      this.loading++
      let data = { email: (usuario.usuario.email).toLowerCase() }
      this.integrador.buscarTransaccionPorEmail(data).subscribe(transacciones => {
        this.loading--
        this.transaccionesAll = transacciones

        if (transacciones.length < 1) {
          this.mys.alertShow('Sin Transacciones', 'alert', 'no hay transacciones registradas para mostrar')
          this.router.navigateByUrl('/my-cancellations')
        } else {
          this.transaccionesAll.forEach(transaccion => {
            // buscando cada boleto de cada transaccion
            this.boletosAll = []
            this.loading++
            this.integrador.buscarBoletoPorCodigo({ email: usuario.usuario.email, codigo: transaccion.codigo }).subscribe(boletos => {
              this.loading--

              // boletos.forEach(boleto => {
              //   if (boleto.estado === 'ACT') {
              //     boleto['selected'] = false
              //     this.boletosAll.push(boleto)
              //   }
              // });
              boletos.forEach(boleto => {
                let estadoBoleto = ''

                if (boleto.estado === 'NUL') {
                  estadoBoleto = 'ANULADO'
                } else {
                  // posibles casos activos
                  let actualDate = moment()

                  let fechaSalida = moment(`${boleto.imprimeVoucher.fechaSalida} ${boleto.imprimeVoucher.horaSalida}`, 'DD/MM/YYYY HH:mm')
                  let fechaSalidaPlus4H = fechaSalida.add(4, 'hours').add(1, 'minute')
                  if (fechaSalida.isBefore(actualDate)) {
                    estadoBoleto = 'INACTIVO'
                  } else {
                    // caso de 4horas para anular 
                    fechaSalida.isBefore(fechaSalidaPlus4H) ? estadoBoleto = 'INACTIVO' : estadoBoleto = 'ACTIVO'
                  }
                }
                boleto['selected'] = false
                boleto['myEstado'] = estadoBoleto
                // this.boletosAll.push(boleto)
                // estadoBoleto === 'ACTIVO' ? this.boletosAll.push(boleto):this.boletosAll.push(boleto)
                estadoBoleto === 'ACTIVO' ? this.boletosAll.push(boleto):null
              });
              console.log('this.boletosAll', this.boletosAll);
            })
          });

        }


      })
    })
  }


  async popMenu(event) {
    console.log('event', event);
    const popoverMenu = await this.popoverCtrl.create({
      component: PopMenuComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popMenu"
    });
    await popoverMenu.present();

    // recibo la variable desde el popover y la guardo en data
    const { data } = await popoverMenu.onWillDismiss();
    if (data && data.destino) {
      if (data.destino === '/login') {
        this.mys.checkIfExistUsuario().subscribe(exist => {
          exist ? this.router.navigateByUrl('/user-panel') : this.router.navigateByUrl('/login');
        })
      } else {
        this.router.navigateByUrl(data.destino);
      }
    }
  }

  async popCart(event) {
    const popoverCart = await this.popoverCtrl.create({
      component: PopCartComponent,
      event,
      mode: 'ios',
      backdropDismiss: true,
      cssClass: "popCart"
    });
    await popoverCart.present();

    // recibo la variable desde el popover y la guardo en data
    // const { data } = await popoverCart.onWillDismiss();
    // this.router.navigateByUrl(data.destino);
  }

  anular() {
    // console.log('this.boletosAll', this.boletosAll);
    // console.log('',);
    if (!this.myData.rutTitular) {
      this.mys.alertShow('Verifique', 'alert', 'Ingrese rut del Titular')
    } else if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(this.myData.rutTitular)) {
      this.mys.alertShow('Verifique', 'alert', 'Ingrese rut del Titular válido, sin puntos ni espacios')
    } else if (!this.myData.banco) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione un Banco')
    } else if (!this.myData.tipoDeCuenta) {
      this.mys.alertShow('Verifique', 'alert', 'Seleccione tipo de cuenta')
    } else if (!this.myData.numeroDeCuenta) {
      this.mys.alertShow('Verifique', 'alert', 'Ingrese un numero de cuenta')
    } else {

      console.log('listooooooxxxxx');
      // this.ionViewWillEnter()
      let contador = 0
      this.boletosAll.forEach(boleto => {
        // selecciona los seleccionado y activos
        if (boleto.selected) {
          contador++
          let data = {
            boleto: boleto.boleto,
            codigoTransaccion: boleto.codigo,
            rutSolicitante: this.usuario.usuario.rut,
            usuario: `${this.usuario.usuario.nombre} ${this.usuario.usuario.apellidoPaterno}`,
            banco: this.myData.banco,
            tipoCuenta: this.myData.tipoDeCuenta,
            numeroCuenta: this.myData.numeroDeCuenta,
            rutTitular: this.myData.rutTitular,
            integrador: boleto.integrador
          }
          // alert(contador)
          // console.log('data', contador, data);
          this.loading++
          this.integrador.anularBoleto(data).subscribe((resultado: any) => {
            this.loading--
            console.log('resultado', resultado);
            if (resultado.exito) {
              alert(`Boleto ${data.boleto} \nFecha:${boleto.imprimeVoucher.fechaSalida}\nHora:${boleto.imprimeVoucher.horaSalida}\nAsiento:${boleto.imprimeVoucher.horaSalida}\n${resultado.mensaje}`)
            } else {
              alert(`Boleto ${data.boleto} \nFecha:${boleto.imprimeVoucher.fechaSalida}\nHora:${boleto.imprimeVoucher.horaSalida}\nAsiento:${boleto.imprimeVoucher.horaSalida}\n${resultado.mensaje}`)
            }
          })

          if (contador === this.nBoletosSeleccionados) {
            this.nBoletosSeleccionados = 0
            this.ionViewWillEnter()
          }
        }
      });
    }

  }

  ionViewWillLeave() {
    this.boletosAll = []
  }

  checkboxChanged() {
    console.log('CHANGED_this.boletosAll', this.boletosAll);
    let nSelected = 0
    this.boletosAll.forEach(element => {
      element.selected ? nSelected++ : null
    });
    this.nBoletosSeleccionados = nSelected
    console.log('nSelected', nSelected);
  }

  actualizar(){
    this.ionViewWillEnter()
  }

}

