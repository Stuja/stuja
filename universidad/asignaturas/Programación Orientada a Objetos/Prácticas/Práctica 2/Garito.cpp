using namespace std;
#include<iostream>
#include<string>
#include "Garito.h"

Garito::Garito(string nombre, string direccion):
    nombre(nombre),
    direccion(direccion)
{}

Garito::Garito(const Garito& orig):
    nombre(orig.nombre),
    direccion(orig.direccion)
{}

Garito::~Garito(){
}

string Garito::GetDireccion() {
        return direccion;
}

void Garito::SetDireccion(string direccion) {
    if (direccion == " "){
        throw string ("\nError: la direccion no puede estar vacia");
    }
    
    this->direccion = direccion;
}

string Garito::GetNombre(){
        return nombre;
}

void Garito::SetNombre(string nombre) {
     if (nombre == " "){
        throw string ("\nError: el nombre no puede estar vacio");
    }
     
    this->nombre = nombre;
}