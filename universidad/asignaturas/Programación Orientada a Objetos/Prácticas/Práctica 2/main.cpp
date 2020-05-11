/* 
 * File:   main.cpp
 * Author: Windows
 *
 * Created on 18 de febrero de 2018, 18:01
 */

#include <cstdlib>
#include <iostream>
#include <string>
#include "Temazo.h"
#include "Garito.h"
#include "Fecha.h"
#include "moduloFunciones.h"

using namespace std;

/*
 * 
 */
int main() {
    
    bool corriendo = true;
    
    Temazo tema1;
    Temazo tema2("Temazo Quiero un 10", "Yo", 0);
    
    if (tema1 < tema2)
        cout << "El tema 1 es de menor duracion";
    else
        cout << "El tema 2 es de mayor duracion";
    
    Garito garito1("Clase de POO", "UJA");
    Garito garito2(garito1);
    
    Fecha fecha1;
    Fecha fecha2(10, 2, 1999);
    
    Fecha fecha3(1, 5, 1999); 
    Fecha fecha4(3, 9, 2012);
    
    Temazo vectorTemazos[20];
    
    Garito* pMicasa;
    pMicasa = new Garito("Casale", "Direccion");
    
    Garito* vecGaritos[10];
    vecGaritos[0] = new Garito("Garito 0", "Direccion 0");
    vecGaritos[1] = new Garito("Garito 1", "Direccion 1");
    vecGaritos[2] = new Garito(*vecGaritos[1]);
    
    for (int i = 0; i < 20; i++){
        cout << vectorTemazos[i].GetInterprete() << endl;
    }
    
    
    while (corriendo){
        int opcion = 0;
        
        cout << endl;
        cout << "\nIntroduce el numero correspondiente para realizar una accion: " << endl;
        cout << "1. Leer datos de temazos." << endl;
        cout << "2. Leer datos de garito." << endl;
        cout << "3. Leer datos de fechas." << endl;
        cout << "4. Modificar los datos del segundo garito." << endl;
        cout << "5. Probar comparaciones." << endl;
        cout << "0. Salir" << endl;
        cout << endl;
        
        cin >> opcion;
        
        switch(opcion){
            case 1:
                cout << "Estos son los datos del tema 1: " << endl;
                mostrar::leerTemazo(tema1);
                cout << "\nEstos son los datos del tema 2: " << endl;
                mostrar::leerTemazo(tema2);
                break;
                
            case 2:
                cout << "\nEstos son los datos del garito 1: " << endl;
                mostrar::leerGarito(garito1);
                cout << "\nEstos son los datos del garito 2: " << endl;
                mostrar::leerGarito(garito2);
                break;
                
            case 3:
                cout << "\nEstos son los datos de la fecha 1: " << endl;
                mostrar::leerFecha(fecha1);
                cout << "\nEstos son los datos de la fecha 2: " << endl;
                mostrar::leerFecha(fecha2);
                break;
                
            case 4:
                try{
                    cout << "\nModifica los datos del Garito 2: " << endl;
                    mostrar::modificarGarito(garito2);
                    mostrar::leerGarito(garito2);
                    break;
                } catch (const string &e) {
                    cout << e << endl;
                }
                
            case 5:
                cout << (fecha3 == fecha4) << endl;
                cout << (fecha3 <= fecha4) << endl;
                cout << (fecha3 >= fecha4) << endl;
                cout << (fecha3 != fecha4) << endl;
                cout << (fecha3 < fecha4) << endl;
                cout << (fecha3 > fecha4) << endl;
                break;
                
            case 0:
                corriendo = false;
                break;
        }
    }
    
    return 0;
}

