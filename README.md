# PCE test endpoints

!Nota importante! Por ahora los token expiran pasados los 15 minutos, siempre.

## Para correr el servicio local:

 - Instalar Node 4.2.3 o 4.2.4 o superior
 - Ejecutar git clone https://github.com/juancancela/pce.git
 - Ejecutar npm install
 - Ejecutar node pce.js  (la app corre en el puerto 3000)


## Para deployarlo:

  - Iniciar sesion ssh
  - Ejecutar:
    * cd /home/juan/apps/pce
    * git pull
    * forever stop pce.js
    * forever start pce.js

## Endpoints (son todos POSTs)
 
## POST /login  (cuenta valida de prueba 12345/12345)

  request:
  *   url: http://localhost:3000/login
  *   headers: n/a
  *   Content-Type: application/json
  *   body : {
      "accountNumber":"12345",
      "password":"12345"
    }

  response:
  * headers: token generado


## POST /sign_up
  
  request:
  *   url: http://localhost:3000/login
  *   headers: n/a
  *   Content-Type: application/json
  *   body : {
      "accountNumber":"423423423423",
      "password":"123fsdf45"
    }

  response:
  *   headers: token generado



## POST /get_bank_details

request:
* url: http://localhost:3000/get_bank_details
* headers: token: incluir token generado en el sign_up o el login
* Content-Type: application/json
* body : n/a

response:
* body: {
    "cta_nro": "1233532523499854932",
    "cbu": "42345gdfgf4323Gfgdfgdfgd"
  }


## POST /get_balance (aka: obtener saldo)

  request:
  *  url: http://localhost:3000/get_balance
  *  headers: token: incluir token generado en el sign_up o el login
  *  Content-Type: application/json
  *  body : n/a

  response:
  *  body: {"msg":0} (si el balance de la cuenta es 0)



## POST /upd_balance (aka: agrega plata a una cuenta)
  
  request:
  *  url: http://localhost:3000/upd_balance
  *  headers: token: incluir token generado en el sign_up o el login
  *  Content-Type: application/json
  *  body : {
     "accountNumber":"12345",
     "transactionId":"1"
   }
     (nota: transactionId validos: 1 (agrega 50), 2 (agrega 10), 3 (agrega 100), 4 (agrega 5000))

  response:
  *  body: {"msg":50} (si el balance de la cuenta es 0, le suma los 50 de la transaction con id = 1)


## POST /get_services (servicios y subservicios)

  request:
  *  url: http://localhost:3000/get_services
  *  headers: token: incluir token generado en el sign_up o el login
  *  Content-Type: application/json
  *  body : n/a
     (nota: transactionId validos: 1 (agrega 50), 2 (agrega 10), 3 (agrega 100), 4 (agrega 5000))

  response:
  *  body: JSON con la lista de servicios y subservicios


## POST /create_transaction

  request:
  *  url: http://localhost:3000/get_transaction
  *  headers: token: incluir token generado en el sign_up o el login
  *  Content-Type: application/json
  *  body : {
	  "accountNumber": "12345",
	  "serviceId": "1",
	  "subserviceId": "11",
	  "subserviceValues": [{
		  "key": "balance",
		  "value": 76
	  }]
     }
     Nota: Las keys del array subserviceValues (objetos del tipo {"key":"keyValue", "value":"value"}) deberian matchear los fields definidos en el array de subservicios, aunque ahora mismo no se valida. Incluir siempre balance, sino, defaultea a 0.

  response:
  *  body: JSON con la lista de servicios y subservicios
  
 
## POST /get_transactions

  request:
  *  url: http://localhost:3000/get_transactions
  *  headers: token: incluir token generado en el sign_up o el login
  *  Content-Type: application/json
  *  body : {
       "accountNumber":"12345"
     }

  response:
  *  body: JSON con las transacciones asociadas al account number
  

## POST /get_profile

  request:
  *  url: http://localhost:3000/get_profile
  *  headers: token: incluir token generado en el sign_up o el login
  *  Content-Type: application/json
  *  body : {
       "accountNumber":"12345"
     }

  response:
  *  body: JSON con el profile asociado al account number provisto
    
  
## POST /upd_profile

  request:
  *  url: http://localhost:3000/upd_profile
  *  headers: token: incluir token generado en el sign_up o el login
  *  Content-Type: application/json
  *  body : {
       "accountNumber":"12345",
       "profile": "Incluir JSON del profile (pisa al anterior profile)"
     }

  response:
  *  body: n/a
    
