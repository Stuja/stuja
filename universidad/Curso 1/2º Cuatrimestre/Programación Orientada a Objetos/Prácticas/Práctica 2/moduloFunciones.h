/* 
 * File:   moduloFunciones.h
 * Author: Windows
 *
 * Created on 20 de febrero de 2018, 13:08
 */

#ifndef MODULOFUNCIONES_H
#define MODULOFUNCIONES_H

#include<iostream>
#include<string>
#include"Temazo.h"
#include"Garito.h"
#include"Fecha.h"

namespace mostrar{
    
void leerTemazo(Temazo &obj);
void leerGarito(Garito &obj);
void leerFecha(Fecha &obj);
void modificarGarito (Garito &obj);

}

#endif /* MODULOFUNCIONES_H */
