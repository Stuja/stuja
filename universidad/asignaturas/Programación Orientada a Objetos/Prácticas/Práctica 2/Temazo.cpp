using namespace std;
#include<iostream>
#include<string>
#include "Temazo.h"

/**
 * @brief Constructor por defecto de la clase Temazo
 */
/*Temazo::Temazo():
    titulo("Temazo por Defecto"), 
    interprete("Interprete por Defecto"), 
    segundos (20), 
    puntuacion (0)
{}*/


/**
 * @brief Constructor parametrizado con valores de inicio
 * @param titulo Es el titulo de la cancion
 * @param interprete Es el que la interpreta
 * @param segundos La duracion en segundos
 * @param puntuacion La puntuacion, siempre 0
 */
Temazo::Temazo(string titulo, string interprete, int segundos, int puntuacion, string nombreUltimoGarito, Fecha ultimaFecha):
    titulo(titulo),
    interprete(interprete),
    segundos (segundos),
    puntuacion (puntuacion),
    nombreUltimoGarito (nombreUltimoGarito),
    ultimaFecha (ultimaFecha)
{}


/**
 * @brief Es un constructor de copia
 * @param orig Es un objeto del mismo tipo, del cual se copiaran los datos
 */
Temazo::Temazo(const Temazo& orig) :
    titulo (orig.titulo),
    interprete (orig.interprete),
    segundos (orig.segundos),
    puntuacion (orig.puntuacion),  
    nombreUltimoGarito (orig.nombreUltimoGarito),
    ultimaFecha(orig.ultimaFecha)
{}


/**
 * @brief Es el destructor del objeto
 */
Temazo::~Temazo(){
}


Temazo::SetTitulo(string titulo){
    this->titulo = titulo;
}

string Temazo::GetTitulo(){
    return this->titulo;
}


Temazo::SetInterprete(string interprete){
    this->interprete = interprete;
}


string Temazo::GetInterprete(){
    return this->interprete;
}


Temazo::SetSegundos(int segundos){
    this->segundos = segundos;
}

Temazo::GetSegundos(){
    return this->segundos;
}

Temazo::GetPuntuacion(){
    return this->puntuacion;
}

string Temazo::GetNombreUltimoGarito() {
        return nombreUltimoGarito;
    }

void Temazo::SetNombreUltimoGarito(string nombreUltimoGarito) {
    this->nombreUltimoGarito = nombreUltimoGarito;
}

Fecha Temazo::GetUltimaFecha() {
    return ultimaFecha;
}

void Temazo::SetUltimaFecha(Fecha ultimaFecha) {
    this->ultimaFecha = ultimaFecha;
}





        