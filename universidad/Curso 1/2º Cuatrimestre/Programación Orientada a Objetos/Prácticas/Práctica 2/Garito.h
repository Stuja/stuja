/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * @name Garito.h
 * @author Javi
 * @brief Cabezera de la clase Garito
 *
 * Created on 18 de febrero de 2018, 18:54
 */

#ifndef GARITO_H
#define GARITO_H

using namespace std;
#include<iostream>
#include<string>


class Garito{
private:
    string nombre;
    string direccion;
public:
    Garito(string nombre = "Nombre defecto", string direccion = "Direccion defecto");
    Garito(const Garito &orig);
    ~Garito();
    string GetDireccion();
    void SetDireccion(string direccion);
    string GetNombre();
    void SetNombre(string nombre);
};


#endif /* GARITO_H */

