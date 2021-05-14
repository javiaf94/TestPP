window.addEventListener("load", function(){
    getDatos();
});



function getDatos(){
    var peticionHttp = new XMLHttpRequest();

    peticionHttp.onreadystatechange = function(){
        if(peticionHttp.readyState == 4 && peticionHttp.status == 200){            
                cargarDatosTabla("tCuerpo", JSON.parse(peticionHttp.responseText));            
                //console.log(peticionHttp.responseText);
        }        
    }
    peticionHttp.open("GET","http://localhost:3000/personas",true);    
    peticionHttp.send();
}


function modificarPersona(objJSON){
    var peticionHttp = new XMLHttpRequest();

    peticionHttp.onreadystatechange = function(){
        mostrarDatos($("spinner"));
        if(peticionHttp.readyState == 4 )
        {  
            ocultarDatos($("spinner"));          
            if( peticionHttp.status == 200)
            {            
                actualizarModificacionTabla(JSON.parse(peticionHttp.responseText));            
                ocultarDatos($("divContDatos"));
            }
        }        
                
    }    
    peticionHttp.open("POST","http://localhost:3000/editar",true);    
    peticionHttp.setRequestHeader("Content-type","application/json");
    var personaString = JSON.stringify(objJSON);
    peticionHttp.send(personaString);
}

function eliminarPersona(idJSON){
    var peticionHttp = new XMLHttpRequest();

    peticionHttp.onreadystatechange = function(){
        mostrarDatos($("spinner"));
        if(peticionHttp.readyState == 4)
        {
            ocultarDatos($("spinner"));
        }
        if(peticionHttp.status == 200)
        {                            
            var fila = $(idJSON.id);
            $("tCuerpo").removeChild(fila);
            ocultarDatos($("divContDatos"));
        }        
    }
    peticionHttp.open("POST","http://localhost:3000/eliminar",true);    
    peticionHttp.setRequestHeader("Content-type","application/json");
    var personaString = JSON.stringify(idJSON);
    peticionHttp.send(personaString);
}




//carga inicial de datos
function cargarDatosTabla(tCuerpo, datosJSON){
    
    
    var cuerpo = $(tCuerpo);
    
    for(var i= 0; i<datosJSON.length;i++)
    {
        var row = document.createElement("tr");
        cuerpo.appendChild(row);
        row.setAttribute("id", JSON.stringify(datosJSON[i].id));
        
        var tdNombre = document.createElement("td");
        row.appendChild(tdNombre);
        var txtNombre = document.createTextNode(datosJSON[i].nombre);
        tdNombre.appendChild(txtNombre);
        
        var tdApellido = document.createElement("td");
        row.appendChild(tdApellido);
        var txtApellido = document.createTextNode(datosJSON[i].apellido);
        tdApellido.appendChild(txtApellido);
        
        var tdFecha = document.createElement("td");
        row.appendChild(tdFecha);
        var txtFecha = document.createTextNode(datosJSON[i].fecha);
        tdFecha.appendChild(txtFecha);
        
        var tdSexo = document.createElement("td");
        row.appendChild(tdSexo);
        var txtSexo = document.createTextNode(datosJSON[i].sexo);
        tdSexo.appendChild(txtSexo);
        
        row.addEventListener("dblclick",mostrarFila);

        /*var tdBorrar = document.createElement("td");
        row.appendChild(tdBorrar);
        var aBorrar = document.createElement("a");
        aBorrar.setAttribute("href","#");
        tdBorrar.appendChild(aBorrar);    
        var txtBorrar = document.createTextNode("Borrar");
        aBorrar.appendChild(txtBorrar);*/
    }
}

function mostrarFila(e){
        
    var fila = e.target.parentNode;    
    
    $("divContDatos").setAttribute("visible", "1");
    
    $("txtNombre").setAttribute("class","sinError");
    $("txtApellido").setAttribute("class","sinError");
    $("txtFecha").setAttribute("class","sinError");
    
    var hijo = fila.firstChild
    $("txtNombre").value = hijo.textContent;
    hijo = hijo.nextSibling;
    $("txtApellido").value = hijo.textContent;
    hijo = hijo.nextSibling;
    $("txtFecha").value = hijo.textContent;        
    hijo = hijo.nextSibling;
    if(hijo.textContent == "Male"){
        $("radioMasc").checked = true;
    }
    else{
        $("radioFem").checked = true;
    }

   $("btnSalir").onclick = function()
   {
       ocultarDatos($("divContDatos"));
   }
   
   $("btnGuardar").onclick=function(){
        var flagError = 0;


        if( $("txtNombre").value.length <=3)
        {
            flagError = 1;
            $("txtNombre").setAttribute("class","conError");
        }
        if( $("txtApellido").value.length <=3)
        {
            flagError = 1;
            $("txtApellido").setAttribute("class","conError");
        }

        var fechaDatos = new Date($("txtFecha").value);
        var fechaActual = Date.now();

        if( fechaActual < fechaDatos)
        {                   
            flagError = 1;
            $("txtFecha").setAttribute("class","conError");
        }
        if($("radioMasc").checked == false && $("radioFem").checked == false)
        {
            flagError = 1;
            $("txtFecha").setAttribute("class","conError");
        }
        if(flagError ==0)
        {
            var sexo = "";
            if($("radioMasc").checked){
                sexo = "Male";
            }
            else{
                sexo = "Female";
            }
            var personaJSON = {id: fila.id, nombre: $("txtNombre").value, apellido: $("txtApellido").value, fecha: $("txtFecha").value, sexo: sexo};            
            modificarPersona(personaJSON);            
        }
    }

    $("btnEliminar").onclick=function()
    {
        var idJSON = {id: fila.id};        
        eliminarPersona(idJSON);     
    }
 }


//modifica tabla una vez se actualizo el json
function actualizarModificacionTabla(objJSON) 
{
    var fila = $(objJSON.id);    
    var hijo = fila.firstChild;
    hijo.innerHTML = objJSON.nombre;
    hijo = hijo.nextSibling;
    hijo.innerHTML = objJSON.apellido;
    hijo = hijo.nextSibling;
    hijo.innerHTML = objJSON.fecha;
    hijo = hijo.nextSibling;
    hijo.innerHTML = objJSON.sexo;
}




function $(id){
    return document.getElementById(id);
}


function ocultarDatos(divDatos){
    divDatos.setAttribute("visible", "0");
}

function mostrarDatos(divDatos){
    divDatos.setAttribute("visible", "1");
}