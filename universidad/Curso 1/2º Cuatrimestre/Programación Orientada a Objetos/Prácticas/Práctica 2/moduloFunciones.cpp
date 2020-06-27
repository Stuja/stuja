/* 
 * File:   moduloFunciones.cpp
 * Author: Windows
 * 
 * Created on 20 de febrero de 2018, 13:08
 */

#include<iostream>
#include<string>
#include "moduloFunciones.h"
#include "Temazo.h"
#include "Garito.h"
#include "Fecha.h"

using namespace std;


void mostrar::leerTemazo(Temazo &obj){
    cout << "\nTitulo: " << obj.GetTitulo();
    cout << "\nInterprete: " << obj.GetInterprete();
    cout << "\nDuracion: " << obj.GetSegundos() << " segundos";
    cout << "\nPuntuacion: " << obj.GetPuntuacion();
    cout << "\nNombre ultimo garito: " << obj.GetNombreUltimoGarito();
    Fecha ultimaFecha = obj.GetUltimaFecha();
    cout << "\nUltima fecha: " << ultimaFecha.GetDia() << "-" << ultimaFecha.GetMes() << "-" << ultimaFecha.GetAnio() << endl;
}

void mostrar::leerGarito(Garito &obj){
    cout << "\nNombre: " << obj.GetNombre();
    cout << "\nDireccion: " << obj.GetDireccion() << endl;
}

void mostrar::leerFecha(Fecha &obj) {
    cout << "\nDia: " << obj.GetDia();
    cout << "\nMes: " << obj.GetMes();
    cout << "\nAnio: " << obj.GetAnio() << endl;
}

void mostrar::modificarGarito(Garito &obj){
    try{
        string nombre, direccion;
        cout << "Introduce un nuevo nombre para el garito: ";
        getline(cin >> ws, nombre);
        obj.SetNombre(nombre);
        cout << "\nIntroduce una nueva direccion para el garito: ";
        getline(cin >> ws, direccion);
        obj.SetDireccion(direccion);
    } catch (string &error) {
        throw string (error);
    }
}



