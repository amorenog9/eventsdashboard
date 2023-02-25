#!/bin/bash

sparkTimestamp=$(ps aux | grep spark-submit | grep -oP ^.*timestampProcessing-assembly-0.1.jar.*$ | grep -oP '^\S+\s+\K\d+')

if [[ -n "$sparkTimestamp" ]]; then
  kill $sparkTimestamp
fi


#-o para imprimir solo la parte de la línea que coincide con el patrón, en lugar de la línea completa.
#-P para habilitar las expresiones regulares de Perl, que admiten características avanzadas como el uso de \K para omitir parte de la coincidencia.
#'^\S+\s+\K\d+' es la expresión regular que se utiliza para buscar el valor del ID del proceso en la salida de ps. La expresión regular se interpreta de la siguiente manera:
#^ indica que la coincidencia debe estar al principio de la línea.
#\S+ busca uno o más caracteres que no sean un espacio en blanco al principio de la línea (que corresponden al nombre del usuario que ejecuta el proceso).
#\s+ busca uno o más caracteres de espacio en blanco después del nombre del usuario.
#\K omite todo lo que se ha encontrado hasta este punto en la expresión regular, de modo que no se incluya en la coincidencia final. Esto se utiliza aquí para omitir el nombre de usuario y los espacios en blanco que lo siguen.
#\d+ busca uno o más dígitos que corresponden al ID del proceso que se desea obtener.






