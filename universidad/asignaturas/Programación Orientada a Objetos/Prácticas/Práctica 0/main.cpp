/**
 * @file main.cpp
 * @author Delunado
 * @date 2 de febrero de 2018
 */


#include <cstdlib>
#include <string>
#include <iostream>
#include <string>

#define MAX_VEHICULOS 20

using namespace std;

/*
 * @brief Estructura que almacena los datos de un vehiculo
 */
struct Vehiculo {
    string marca; ///< marca del vehiculo
    string modelo; /// < modelo del vehiculo
    string matricula; ///< matricula del vehiculo
    float precio; ///< precio de venta al publico
    int anio; ///< año de fabricante
};

/**
 * @brief permite introducir por teclado los datos de un vehiculo
 * @param v vehiculo del que voy a leer los datos
 */

void leePorTeclado(Vehiculo &v){
    cout << "Introduce la marca" << endl;
    cout << ">";
    cin >> v.marca;
}

/**
 * @brief permite introducir por teclado los datos de un vehiculo
 * @param v vehiculo del que voy a leer los datos
 */

void leePorTeclado(Vehiculo *v){
    cout << "Introduce la marca" << endl;
    cout << ">";
    cin >> v->marca;
}

/*
 * @brief funcion que muestra los datos de un vehiculo
 * @param v vehiculo del que se van a mostrar los datos
 */
void muestraPorPantalla(Vehiculo &v){

    cout << "Marca del vehiculo: " << v.marca << endl;
    cout << "Modelo del vehiculo: " << v.modelo << endl;
}

/**
 * @brief funcion que devuelve el precio y el anio de un vehiculo dado
 * @param v es el vehiculo dado
 * @param precio es el precio del vehiculo
 * @param anio es el anio del vehiculo
 */
void DevolverAnioPrecio(Vehiculo &v, float *precio, int &anio){

    anio = v.anio;
    *precio = v.precio;
    
}

int main(int argc, char** argv) {

    Vehiculo vec[MAX_VEHICULOS];
    int num_veh;
    
    Vehiculo vehiculo;
    int anioVehiculo;
    float precioVehiculo;
    
    vehiculo.precio = 105.5;
    vehiculo.anio = 12;
    
    DevolverAnioPrecio(vehiculo, &precioVehiculo, anioVehiculo);
    
    cout << "Cuantos vehiculos desea introducir?";
    cin >> num_veh;
    
    for (int i = 0; i < num_veh; i++) {
        leePorTeclado(&vec[i]);
    }
    
     for (int i = 0; i < num_veh; i++) {
        muestraPorPantalla(vec[i]);
    } 
    
    return 0;
}

